import { db } from "@/db"
import { companies, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { JWT } from "@/lib/JWT.server"
import { TokenUtil } from "@/lib/token.server"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import ms, { StringValue } from "ms"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const errorFields: string[] = []

    if (!email) errorFields.push("email")
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
      .where(eq(users.email, email))
      .leftJoin(companies, eq(users.companyId, companies.id))

    const hashedPassword = TokenUtil.hashPassword(password)

    if (!employee || hashedPassword! == password) {
      return Response.json({ error: "Invalid credential." }, { status: 401 })
    }

    const formattedEmployee = { ...employee.users, company: employee.companies }

    if (
      formattedEmployee.mustChangePassword &&
      formattedEmployee.passwordExpiresAt &&
      formattedEmployee.passwordExpiresAt.getTime() < Date.now()
    ) {
      return Response.json(
        {
          error:
            "Temporary password expired, please contact HR of changed your password",
        },
        { status: 403 }
      )
    }

    const jwtToken = await JWT.signJWT({
      id: formattedEmployee.id,
      role: formattedEmployee.role,
    })

    const cookieStore = await cookies()
    cookieStore.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ms(process.env.JWT_EXPIRY as StringValue),
    })

    const { password: userPassword, ...publicUser } = formattedEmployee
    void userPassword

    return Response.json({ user: publicUser }, { status: 200 })
  } catch (error) {
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    console.log(error)
    // Everything else
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
