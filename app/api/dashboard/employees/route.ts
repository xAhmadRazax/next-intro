import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { db } from "@/db"
import { companies, users } from "@/db/schema"
import { and, count, eq, ilike, ne } from "drizzle-orm"
import { cloudinaryService } from "@/lib/cloudinary.server"
import { TokenUtil } from "@/lib/token.server"
import { Mailer } from "@/lib/mailer.server"
import { COMPANY_NAME, TEMP_PASSWORD_EXPIRY } from "@/constants/constants"
import ms, { StringValue } from "ms"
import { RouteGuard } from "@/lib/routeGuard.server"

export const POST = RouteGuard.requireAuthWithRole(
  async (req: Request) => {
    const formData = await req.formData()

    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const companyId = formData.get("companyId") as string
    const avatar = formData.get("avatar") as File

    let avatarObj: { url: string; publicId: string } | null = null
    try {
      const fields: Record<string, string> = {}
      if (!email) fields.email = "Email is required"
      if (!username) fields.name = "Username is required"
      if (!companyId) fields.company = "company is required"

      if (Object.keys(fields).length > 0) {
        return Response.json(
          { error: "Missing required fields", fields },
          { status: 400 }
        )
      }

      if (avatar instanceof File) {
        const cloudinaryRes = await cloudinaryService.streamUpload(avatar)
        avatarObj = {
          url: cloudinaryRes.secure_url,
          publicId: cloudinaryRes.public_id,
        }
      }

      const { raw, hashed } = await TokenUtil.generate({
        bytesSize: 4,
        bufferEncoding: "base64",
        hashMethod: "bcrypt",
      })

      const [employee] = await db
        .insert(users)
        .values({
          username,
          email: email.toLowerCase(),
          companyId,
          password: hashed,
          passwordExpiresAt: new Date(
            Date.now() + ms(TEMP_PASSWORD_EXPIRY as StringValue)
          ),
          avatar: avatarObj?.url ?? null,
          avatarPublicId: avatarObj?.publicId ?? null,
        })
        .returning()

      Mailer.sendInvite({
        companyName: COMPANY_NAME,
        email,
        tempPassword: raw,
        username,
      })

      return Response.json({ employee }, { status: 201 })
    } catch (error: unknown) {
      if (avatarObj?.publicId)
        cloudinaryService.deleteFromCloudinary(avatarObj.publicId)

      const postgresError = handlePostgresError(error)
      if (postgresError) return postgresError

      // Handle JSON parsing error
      if (error instanceof SyntaxError) {
        return Response.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin"]
)

export const GET = RouteGuard.requireAuthWithRole(
  async (req: Request) => {
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
        emailFilter ? ilike(users.email, `%${emailFilter}%`) : undefined,
        nameFilter ? ilike(users.username, `%${nameFilter}%`) : undefined,
        companyFilter ? eq(users.companyId, companyFilter) : undefined,
        ne(users.role, "admin")
      )

    // const [data, [{ total }]] = await Promise.all([
    //   db.query.users.findMany({
    //     limit: !getAll ? limit : undefined,
    //     offset: !getAll ? offset : undefined,
    //     where: whereClause(users),
    //     with: { company: true },
    //     orderBy: (table, { asc, desc }) => [
    //       order === "asc" ? asc(table.createdAt) : desc(table.createdAt),
    //     ],
    //   }),
    //   db.select({ total: count() }).from(users).where(whereClause(users)),
    // ])

    const [data, [{ total }]] = await Promise.all([
      db
        .select()
        .from(users)
        .leftJoin(companies, eq(users.companyId, companies.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(users)
        .leftJoin(companies, eq(users.companyId, companies.id))
        .where(whereClause),
    ])

    const totalPages = Math.ceil(total / limit)
    const mapped = data.map(({ users, companies }) => ({
      ...users,
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
  },
  ["admin"]
)
