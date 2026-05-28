import { db } from "@/db"
import { users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { JWT } from "@/lib/JWT.server"
import { TokenUtil } from "@/lib/token.server"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

export async function PATCH(req: Request) {
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

    const { currentPassword, password } = await req.json()

    const errorFields: string[] = []

    if (!password) errorFields.push("password")

    if (errorFields.length > 0) {
      return Response.json(
        { error: "Missing required fields", fields: errorFields },
        { status: 400 }
      )
    }
    const [employee] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id))

    if (!employee) {
      return Response.json(
        { error: `User with the ${payload.id} does'nt exist` },
        { status: 404 }
      )
    }

    const hashedCurrentPassword = await TokenUtil.hashPassword(currentPassword)
    console.log(employee.password, hashedCurrentPassword, currentPassword)

    if (employee.password !== hashedCurrentPassword) {
      return Response.json({ error: `Invalid Credentials` }, { status: 401 })
    }

    if (
      employee.mustChangePassword &&
      employee.passwordExpiresAt &&
      Date.now() > employee.passwordExpiresAt.getTime()
    ) {
      return Response.json(
        {
          error:
            "Temporary password expired, please contact HR or changed your password",
        },
        { status: 403 }
      )
    }

    const hashedPassword = await TokenUtil.hashPassword(password)

    await db
      .update(users)
      .set({
        password: hashedPassword,
        mustChangePassword: false,
        passwordExpiresAt: null,
      })
      .where(eq(users.id, employee.id))

    return Response.json(
      { message: "Password changed Successfully." },
      { status: 200 }
    )
  } catch (err) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
