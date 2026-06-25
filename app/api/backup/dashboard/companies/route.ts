// import { db } from "@/db"
// import { companies } from "@/db/schema"
// import { ilike, count, and } from "drizzle-orm"
// import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
// import { cloudinaryService } from "@/lib/cloudinary.server"
// import { RouteGuard } from "@/lib/routeGuard.server"

// export const GET = RouteGuard.requireAuthWithRole(
//   async (req: Request) => {
//     const { searchParams } = new URL(req.url)

//     const getAll = Boolean(searchParams.get("getAll"))
//     const page = Number(searchParams.get("page") || 1)
//     const limit = Number(searchParams.get("limit") || 20)
//     const emailFilter = searchParams.get("email") || ""
//     const nameFilter = searchParams.get("name") || ""
//     // const order = searchParams.get("order") || "asc"

//     const offset = (page - 1) * limit

//     type CompanyType = typeof companies

//     const whereClause = (table: CompanyType) =>
//       and(
//         emailFilter ? ilike(table.email, `%${emailFilter}%`) : undefined,
//         nameFilter ? ilike(table.name, `%${nameFilter}%`) : undefined
//       )

//     const [data, [{ total }]] = await Promise.all([
//       db.query.companies.findMany({
//         columns: getAll ? { name: true, id: true } : undefined,
//         limit: !getAll ? limit : undefined,
//         offset: !getAll ? offset : undefined,
//         where: whereClause(companies),
//         // orderBy: (table, { asc, desc }) => [
//         //   order === "asc" ? asc(table.createdAt) : desc(table.createdAt),
//         // ],
//         orderBy: (companies, { asc }) => [asc(companies.createdAt)],
//       }),
//       db
//         .select({ total: count() })
//         .from(companies)
//         .where(whereClause(companies)),
//     ])

//     const totalPages = Math.ceil(total / limit)

//     return Response.json({
//       data,
//       meta: {
//         itemsPerPage: limit,
//         currentPage: page,
//         hasNext: page < totalPages,
//         hasPrev: page > 1,
//         nextPage: page < totalPages ? page + 1 : null,
//         prevPage: page > 1 ? page - 1 : null,
//         totalPages,
//       },
//     })
//   },
//   ["admin"]
// )

// export const POST = RouteGuard.requireAuthWithRole(
//   async (req: Request) => {
//     const formData = await req.formData()
//     const name = formData.get("name") as string
//     const email = formData.get("email") as string
//     const address = formData.get("address") as string
//     const logo = formData.get("logo")
//     const logoFile = logo instanceof File ? logo : null

//     let logoObj: { url: string; publicId: string } | null = null

//     // validate fields
//     const fields: Record<string, string> = {}
//     if (!email) fields.email = "Email is required"
//     if (!name) fields.name = "Name is required"
//     if (!address) fields.address = "Address is required"

//     if (Object.keys(fields).length > 0) {
//       return Response.json(
//         { error: "Missing required fields", fields },
//         { status: 400 }
//       )
//     }

//     try {
//       if (logoFile) {
//         const cloudinaryRes = await cloudinaryService.streamUpload(logoFile)
//         logoObj = {
//           url: cloudinaryRes.url,
//           publicId: cloudinaryRes.publicId,
//         }
//       }

//       const [company] = await db
//         .insert(companies)
//         .values({
//           name,
//           email,
//           address,
//           logo: logoObj?.url ?? null,
//           logoPublicId: logoObj?.publicId ?? null,
//         })
//         .returning()

//       return Response.json(company, { status: 201 })
//     } catch (err: unknown) {
//       if (logoObj?.publicId) {
//         await cloudinaryService.deleteFromCloudinary(logoObj.publicId)
//       }

//       const postgresError = handlePostgresError(err)
//       if (postgresError) return postgresError

//       if (err instanceof SyntaxError) {
//         return Response.json({ error: "Invalid JSON format" }, { status: 400 })
//       }

//       return Response.json({ error: "Internal server error" }, { status: 500 })
//     }
//   },
//   ["admin"]
// )
