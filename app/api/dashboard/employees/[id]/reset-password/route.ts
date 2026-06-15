import { COMPANY_NAME } from "@/constants/constants"
import { db } from "@/db"
import { users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { Mailer } from "@/lib/mailer.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { TokenUtil } from "@/lib/token.server"
import { eq } from "drizzle-orm"
import ms, { StringValue } from "ms"

export const POST = RouteGuard.requireAuthWithRole(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params

      const [employee] = await db.select().from(users).where(eq(users.id, id))

      if (!employee) {
        return Response.json(
          { error: `User with the ${id} does'nt exist` },
          { status: 404 }
        )
      }

      const { raw, hashed } = await TokenUtil.generate({
        bytesSize: 4,
        bufferEncoding: "base64",
        hashMethod: "bcrypt",
      })

      await db.update(users).set({
        password: hashed,
      })

      Mailer.hrSendPasswordReset({
        email: employee.email,
        username: employee.username,
        companyName: COMPANY_NAME,
        tempPassword: raw,
      })

      return Response.json(
        { message: "password resets successfully" },
        { status: 200 }
      )
    } catch (err) {
      const postgresError = handlePostgresError(err)
      if (postgresError) return postgresError

      // Handle JSON parsing error
      if (err instanceof SyntaxError) {
        return Response.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      // Everything else
      console.error(err)
      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin"]
)
