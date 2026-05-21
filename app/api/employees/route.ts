import { handlePostgresError } from "@/lib/drizzle-error-handler"
import { CreateEmployeeDto } from "./dtos/createEmployee.dto"
import { db } from "@/db"
import { companies, employees } from "@/db/schema"
import { and, count, eq, ilike } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const { username, email, companyId, avatar } =
      (await req.json()) as CreateEmployeeDto
    const errorFields: string[] = []
    if (!username) {
      errorFields.push("username")
    }
    if (!email) {
      errorFields.push("email")
    }
    if (!companyId) {
      errorFields.push("companyId")
    }

    if (errorFields.length > 0) {
      return Response.json(
        { error: "missing required fields", fields: errorFields },
        { status: 400 }
      )
    }

    const [employee] = await db
      .insert(employees)
      .values({ username, email, companyId, avatar })
      .returning()

    return Response.json({ employee }, { status: 201 })
  } catch (error: unknown) {
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    console.log(error)
    // Everything else
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  console.log("im being hit")
  const { searchParams } = new URL(req.url)

  const getAll = Boolean(searchParams.get("getAll"))
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 20)
  const emailFilter = searchParams.get("email") || ""
  const nameFilter = searchParams.get("username") || ""
  const companyFilter = searchParams.get("company") || ""
  const order = searchParams.get("order") || "asc"

  console.log("filters", nameFilter, emailFilter)

  const offset = (page - 1) * limit

  const whereClause = () =>
    and(
      emailFilter ? ilike(employees.email, `%${emailFilter}%`) : undefined,
      nameFilter ? ilike(employees.username, `%${nameFilter}%`) : undefined,
      companyFilter ? eq(employees.companyId, companyFilter) : undefined
    )

  // const [data, [{ total }]] = await Promise.all([
  //   db.query.employees.findMany({
  //     limit: !getAll ? limit : undefined,
  //     offset: !getAll ? offset : undefined,
  //     where: whereClause(employees),
  //     with: { company: true },
  //     orderBy: (table, { asc, desc }) => [
  //       order === "asc" ? asc(table.createdAt) : desc(table.createdAt),
  //     ],
  //   }),
  //   db.select({ total: count() }).from(employees).where(whereClause(employees)),
  // ])

  const [data, [{ total }]] = await Promise.all([
    db
      .select()
      .from(employees)
      .leftJoin(companies, eq(employees.companyId, companies.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(employees)
      .leftJoin(companies, eq(employees.companyId, companies.id))
      .where(whereClause),
  ])

  const totalPages = Math.ceil(total / limit)
  const mapped = data.map(({ employees, companies }) => ({
    ...employees,
    company: companies,
  }))

  // console.log("data", data, emailFilter, nameFilter)

  return Response.json({
    data: mapped,
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
