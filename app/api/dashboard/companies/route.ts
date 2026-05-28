import { db } from "@/db"
import { companies } from "@/db/schema"
import { ilike, count, and } from "drizzle-orm"
import { CreateCompanyDto } from "./dtos/createCompanyDto"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { cloudinaryService } from "@/lib/cloudinary.server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const getAll = Boolean(searchParams.get("getAll"))
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
      limit: !getAll ? limit : undefined,
      offset: !getAll ? offset : undefined,
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
  const formData = await req.formData()
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  const logo = formData.get("logo") as File

  let logoObj: { url: string; public_Id: string } | null = null

  const errorFields: string[] = []
  if (!email) {
    errorFields.push("email")
  }
  if (!name) {
    errorFields.push("name")
  }
  if (!address) {
    errorFields.push("address")
  }

  try {
    if (errorFields.length > 0) {
      return Response.json(
        { error: "Missing required fields", fields: errorFields },
        { status: 400 }
      )
    }

    if (logo instanceof File) {
      const cloudinaryRes = await cloudinaryService.streamUpload(logo)
      logoObj = {
        url: cloudinaryRes.secure_url,
        public_Id: cloudinaryRes.public_id,
      }
    }

    const [company] = await db
      .insert(companies)
      .values({
        name,
        email,
        address,
        logo: logoObj?.url ?? null,
        logoPublicId: logoObj?.public_Id ?? null,
      })
      .returning()

    return Response.json(company, { status: 201 })
  } catch (err: unknown) {
    if (logoObj?.public_Id)
      cloudinaryService.deleteFromCloudinary(logoObj.public_Id)

    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    // Everything else
    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
