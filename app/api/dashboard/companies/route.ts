import { db } from "@/db"
import { companies, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { TokenUtil } from "@/lib/token.server"
import { and, count, eq, ilike, isNull } from "drizzle-orm"

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData()

    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const logo = formData.get("logo")
    const logoFile = logo instanceof File ? logo : null

    const errorFields: Record<string, string> = {}

    if (!name) {
      errorFields.name = "Name is Required."
    }
    if (!address) {
      errorFields.address = "Address is Required."
    }
    if (!email) {
      errorFields.email = "Email is Required."
    }
    if (!password) {
      errorFields.password = "Password is Required."
    }

    if (Object.keys(errorFields).length > 0) {
      return Response.json(
        { error: "Missing required fields", errorFields },
        { status: 400 }
      )
    }

    const hashed = await TokenUtil.hashPassword(password)

    const [company] = await db
      .insert(companies)
      .values({
        email,
        name,
        address: address,
      })
      .returning()

    const [createdUser] = await db
      .insert(users)
      .values({
        email: email.toLocaleLowerCase(),
        name,
        companyId: company.id,
        role: "company",
        password: hashed,
      })
      .returning()

    const companyData = await db.query.users.findFirst({
      where: eq(users.id, createdUser.id),
      with: {
        company: true,
      },
      columns: {
        password: false,
      },
    })

    // ✅ Check if data exists
    if (!companyData || !companyData.company) {
      return Response.json(
        { error: "Failed to create company" },
        { status: 500 }
      )
    }
    return Response.json(
      {
        id: companyData.id,
        name: companyData.name,
        email: companyData.email,
        address: companyData.company.address,
        logo: companyData.company.logo,
        createdAt: companyData.company.createdAt,
        updatedAt: companyData.company.updatedAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = async (req: Request) => {
  try {
    // const companies = await db.query.users.findMany({
    //   where: and(isNull(users.employeeId), isNotNull(users.companyId)),
    //   with: {
    //     company: true,
    //   },
    // })

    // return Response.json(companies, { status: 201 })
    const { searchParams } = new URL(req.url)

    const getAll = Boolean(searchParams.get("getAll")) ?? false
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 20)
    const emailFilter = searchParams.get("email") || ""
    const nameFilter = searchParams.get("name") || ""
    // const order = searchParams.get("order") || "asc"

    const offset = (page - 1) * limit

    const whereClause = and(
      emailFilter ? ilike(users.email, `%${emailFilter}%`) : undefined,
      nameFilter ? ilike(users.name, `%${nameFilter}%`) : undefined,
      isNull(users.employeeId),
      eq(users.role, "company")
    )
    const [data, [{ total }]] = await Promise.all([
      db.query.users.findMany({
        columns: !!getAll
          ? { name: true, email: true, id: true, password: false }
          : { password: false },
        limit: !getAll ? limit : undefined,
        offset: !getAll ? offset : undefined,
        where: whereClause,
        with: {
          company: true,
        },
        // orderBy: (table, { asc, desc }) => [
        //   order === "asc" ? asc(table.createdAt) : desc(table.createdAt),
        // ],
        orderBy: (companies, { asc }) => [asc(companies.createdAt)],
      }),
      db.select({ total: count() }).from(users).where(whereClause),
    ])

    // console.log(data, "companies")
    const totalPages = Math.ceil(total / limit)

    const formattedData = data.map((item) => ({
      id: item.company?.id,
      name: item.company?.name,
      logo: item.company?.logo,
      email: item.company?.email,
      address: item.company?.address,
      createdAt: item.company?.createdAt,
      updatedAt: item.company?.updatedAt,
      role: "company",
    }))

    return Response.json({
      companies: formattedData,
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
  } catch (error) {
    console.log(error)
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
