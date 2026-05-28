import { db } from "@/db"
import { companies, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { JWT } from "@/lib/JWT.server"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

export async function POST() {
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

    const [res] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .leftJoin(companies, eq(users.companyId, companies.id))

    if (!res.users) {
      return Response.json(
        { error: `User with the ${payload.id} does'nt exist` },
        { status: 404 }
      )
    }

    const { password, ...publicUser } = { ...res.users, company: res.companies }
    void password
    return Response.json({ user: publicUser }, { status: 200 })
  } catch (err) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
