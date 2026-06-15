import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { db } from "@/db"
import { companies, tokens, users } from "@/db/schema"
import { and, count, eq, ilike, ne } from "drizzle-orm"
import { cloudinaryService } from "@/lib/cloudinary.server"
import { TokenUtil } from "@/lib/token.server"
import { Mailer } from "@/lib/mailer.server"
import { COMPANY_NAME } from "@/constants/constants"
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

      const [employee] = await db
        .insert(users)
        .values({
          username,
          email: email.toLowerCase(),
          companyId,
          avatar: avatarObj?.url ?? null,
          avatarPublicId: avatarObj?.publicId ?? null,
        })
        .returning()

      const { raw, hashed } = await TokenUtil.generate()

      await db.insert(tokens).values({
        token: hashed,
        type: "invite",
        userId: employee.id,
        expiresAt: new Date(
          Date.now() + ms(process.env.INVITE_TOKEN_EXPIRY as StringValue)
        ),
      })

      const inviteLink = `${req.headers.get("origin")}/auth/set-password/${raw}`

      Mailer.sendInvite({
        companyName: COMPANY_NAME,
        email,
        inviteLink: inviteLink,
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

    const [data, [{ total }]] = await Promise.all([
      db.query.users.findMany({
        where: whereClause,
        with: {
          attendance: true,
          company: true,
        },
        limit: limit,
        offset: offset,
      }),

      db
        .select({ total: count() })
        .from(users)
        .leftJoin(companies, eq(users.companyId, companies.id))
        .where(whereClause),
    ])

    const formattedData = data.map((employee) => {
      const attendanceLogs = employee.attendance ?? []

      // total minutes across all completed shifts
      const totalMins = attendanceLogs.reduce((sum, log) => {
        if (!log.checkIn || !log.checkOut) return sum
        return (
          sum +
          Math.round(
            (new Date(log.checkOut).getTime() -
              new Date(log.checkIn).getTime()) /
              60000
          )
        )
      }, 0)

      // last activity = most recent checkIn date
      const lastActivity =
        attendanceLogs
          .filter((log) => log.checkIn)
          .sort(
            (a, b) =>
              new Date(b.checkIn!).getTime() - new Date(a.checkIn!).getTime()
          )
          .at(0)?.checkIn ?? null

      // total hours formatted
      const totalHours =
        totalMins < 60
          ? `${totalMins}m`
          : `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`

      return {
        ...employee,
        attendance: undefined, // ✅ drop raw logs
        stats: {
          totalHours, // "42h 30m"
          totalMins, // 2550 (raw for sorting)
          lastActivity: lastActivity
            ? new Date(lastActivity).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : null, // "Jun 9, 2026"
          lastActivityRaw: lastActivity, // raw date for sorting
        },
      }
    })

    const totalPages = Math.ceil(total / limit)

    return Response.json({
      data: formattedData,
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
