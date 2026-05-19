import { db } from "@/db"
import { companies } from "@/db/schema"
import { ilike, count, and } from "drizzle-orm"
import { CreateCompanyDto } from "./dtos/createCompanyDto"
import { handlePostgresError } from "@/lib/drizzle-error-handler"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 20)
  const emailFilter = searchParams.get("email") || ""
  const nameFilter = searchParams.get("name") || ""
  const order = searchParams.get("order") || "asc"

  const offset = (page - 1) * limit

  type CompanyType = typeof companies

  const whereClause = (table: CompanyType) =>
    and(
      emailFilter ? ilike(table.email, `%${emailFilter}%`) : undefined,
      nameFilter ? ilike(table.name, `%${nameFilter}%`) : undefined
    )

  const [data, [{ total }]] = await Promise.all([
    db.query.companies.findMany({
      limit,
      offset,
      where: whereClause(companies),
      orderBy: (table, { asc, desc }) => [
        order === "asc" ? asc(table.createdAt) : desc(table.createdAt),
      ],
    }),
    db.select({ total: count() }).from(companies).where(whereClause(companies)),
  ])

  const totalPages = Math.ceil(total / limit)

  console.log("currentPage", page)
  console.log("filters", emailFilter, nameFilter, "filters")
  // console.log("data", data, emailFilter, nameFilter)

  return Response.json({
    data,
    meta: {
      itemsPerPage: limit,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages,
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateCompanyDto
    const { name, email, address, logo } = body
    console.log(name, email, address, logo)

    if (!name || !email || !address) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const [company] = await db
      .insert(companies)
      .values({ name, email, address, logo })
      .returning()

    return Response.json(company, { status: 201 })
  } catch (err: unknown) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (err instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    // Everything else
    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
