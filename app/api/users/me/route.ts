import { db } from "@/db"
import { companies, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { JWT } from "@/lib/JWT.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

export const POST = RouteGuard.requireAuth(async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) {
      return Response.json({ error: "Unauthorized access" }, { status: 403 })
    }
    const payload = await JWT.safeVerifyJWT(token)
    if (!payload) {
      cookieStore.delete("token")
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    const userId = payload.id

    // const [res] = await db
    //   .select()
    //   .from(users)
    //   .where(eq(users.id, userId))
    //   .leftJoin(companies, eq(users.companyId, companies.id))

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        company: true,
        // attendance: true,
      },
    })

    if (!user?.id) {
      return Response.json(
        { error: `User with the ${payload.id} does'nt exist` },
        { status: 404 }
      )
    }

    const { password, ...publicUser } = user
    void password
    return Response.json({ user: publicUser }, { status: 200 })
  } catch (err) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
})
