import { COMPANY_NAME } from "@/constants/constants"
import { db } from "@/db"
import { tokens, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { Mailer } from "@/lib/mailer.server"
import { TokenUtil } from "@/lib/token.server"
import { eq } from "drizzle-orm"
import ms, { StringValue } from "ms"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return Response.json(
        { error: "Missing Required Fields", fields: ["email"] },
        { status: 400 }
      )
    }

    const [employee] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (employee) {
      if (
        employee.mustChangePassword &&
        employee.passwordExpiresAt &&
        Date.now() > employee.passwordExpiresAt.getTime()
      ) {
        return Response.json(
          {
            error: "Temporary password expired, please contact HR",
          },
          { status: 403 }
        )
      }
      const { raw, hashed } = await TokenUtil.generate({})

      console.log(raw, hashed)

      await db.insert(tokens).values({
        userId: employee.id,
        type: "password_resets",
        expiresAt: new Date(
          Date.now() +
            ms(process.env.RESET_PASSWORD_TOKEN_EXPIRY as StringValue)
        ),
        token: hashed,
      })

      const resetLink = `${req.headers.get("origin")}/auth/reset-password/${raw}`
      await Mailer.sendForgotPassword({
        email: employee.email,
        username: employee.username,
        companyName: COMPANY_NAME,
        resetLink,
      })
    }

    return Response.json(
      {
        message:
          "If this email exists, you will receive a password reset link shortly.",
      },
      { status: 200 }
    )
  } catch (err) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
