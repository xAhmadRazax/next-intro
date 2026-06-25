import { db } from "@/db"
import { users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"
import { eq } from "drizzle-orm"

export const POST = RouteGuard.requireAuth(async (req) => {
  try {
    const authReq = req as AuthReqType
    const userId = authReq.user

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId.id),
      with: {
        company: true,
        employee: true,
        // attendance: true,
      },
    })

    if (!user?.id) {
      return Response.json({ error: `User  doesn't exist` }, { status: 404 })
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
