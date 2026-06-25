import { db } from "@/db"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"

export const GET = RouteGuard.requireAuth(async (req) => {
  try {
    const departments = await db.query.departments.findMany({
      with: { roles: true },
    })

    return Response.json(departments, { status: 200 })
  } catch (err) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
})
