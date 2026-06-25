import { db } from "@/db"
import { companies, employees, PublicUserType, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { TokenUtil } from "@/lib/token.server"
import { AuthReqType } from "@/types/authReq.type"
import { CompanyType } from "@/types/dashboard.types"
import { and, eq, ilike, isNotNull, count } from "drizzle-orm"

export const POST = RouteGuard.requireAuthWithRole(
  async (req: Request) => {
    console.log("im being hit")
    const authReq = req as AuthReqType
    const user = authReq.user

    let companyId = ""

    console.log(user, user.role)

    if (user.role === "company" && user.companyId) {
      companyId = user.companyId
    }

    const formData = await req.formData()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const password = formData.get("password") as string
    const designation = formData.get("designation") as string
    const phone = formData.get("phone") as string

    console.log(name, "usernams")
    //   const departmentId = formData.get("departmentId") as string
    //   const roleId = formData.get("roleId") as string
    const avatar = formData.get("avatar") as File

    try {
      const fields: Record<string, string> = {}
      if (!email) fields.email = "Email is required"
      if (!name) fields.name = "name is required"
      if (!password) fields.password = "password is required"
      if (!companyId) fields.company = "company id is required"
      if (!designation) fields.role = "role is required"

      if (Object.keys(fields).length > 0) {
        return Response.json(
          { error: "Missing required fields", fields },
          { status: 400 }
        )
      }

      const hashed = await TokenUtil.hashPassword(password)

      const [employee] = await db
        .insert(employees)
        .values({
          address,
          designation,
          phone,
        })
        .returning()

      const [userRec] = await db
        .insert(users)
        .values({
          email,
          password: hashed,
          name,
          companyId,
          employeeId: employee.id,
          role: "employee",
        })
        .returning()

      const user = await db.query.users.findFirst({
        where: eq(users.id, userRec.id),
        with: {
          company: true,
          employee: true,
        },
      })

      return Response.json(user, { status: 201 })
    } catch (error: unknown) {
      const postgresError = handlePostgresError(error)
      if (postgresError) return postgresError

      // Handle JSON parsing error
      if (error instanceof SyntaxError) {
        return Response.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin", "company"]
)

export const GET = RouteGuard.requireAuthWithRole(
  async (req) => {
    try {
      console.log("request reaching the  route ")
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

      const whereClause = and(
        emailFilter ? ilike(users.email, `%${emailFilter}%`) : undefined,
        nameFilter ? ilike(users.name, `%${nameFilter}%`) : undefined,
        companyFilter ? eq(users.companyId, companyFilter) : undefined,
        eq(users.role, "employee"),
        isNotNull(users.companyId)
      )

      const [data, [{ total }]] = await Promise.all([
        db.query.users.findMany({
          where: whereClause,
          with: {
            // attendance: true,
            company: true,
            employee: true,
            // department: true,

            // jobTitle: true,
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
        // const attendanceLogs = employee.attendance ?? []

        // total minutes across all completed shifts
        // const totalMins = attendanceLogs.reduce((sum, log) => {
        //   if (!log.checkIn || !log.checkOut) return sum
        //   return (
        //     sum +
        //     Math.round(
        //       (new Date(log.checkOut).getTime() -
        //         new Date(log.checkIn).getTime()) /
        //         60000
        //     )
        //   )
        // }, 0)

        // last activity = most recent checkIn date
        // const lastActivity =
        //   attendanceLogs
        //     .filter((log) => log.checkIn)
        //     .sort(
        //       (a, b) =>
        //         new Date(b.checkIn!).getTime() - new Date(a.checkIn!).getTime()
        //     )
        //     .at(0)?.checkIn ?? null

        // total hours formatted
        // const totalHours =
        //   totalMins < 60
        //     ? `${totalMins}m`
        //     : `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`

        return {
          ...employee,
          // attendance: undefined, // ✅ drop raw logs
          stats: {
            // totalHours, // "42h 30m"
            // totalMins, // 2550 (raw for sorting)
            // lastActivity: lastActivity
            // ? new Date(lastActivity).toLocaleDateString("en-US", {
            // month: "short",
            // day: "numeric",
            // year: "numeric",
            // })
            // : null, // "Jun 9, 2026"
            // lastActivityRaw: lastActivity, // raw date for sorting
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
    } catch (error) {
      console.log(error, "errrror")
      const postgresError = handlePostgresError(error)
      if (postgresError) return postgresError

      // Handle JSON parsing error
      if (error instanceof SyntaxError) {
        return Response.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin", "company"]
)
