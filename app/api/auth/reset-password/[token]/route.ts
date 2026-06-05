import { db } from "@/db"
import { tokens, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { TokenUtil } from "@/lib/token.server"
import { eq } from "drizzle-orm"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token)
      return Response.json({ error: "Token required" }, { status: 400 })

    const { password } = await req.json()

    if (!password) {
      return Response.json(
        { error: "Missing required field", fields: ["password"] },
        { status: 400 }
      )
    }

    const hashedToken = TokenUtil.hashToken(token)
    const hashedPassword = await TokenUtil.hashPassword(password)

    const [tokenRec] = await db
      .select()
      .from(tokens)
      .where(eq(tokens.token, hashedToken))
      .leftJoin(users, eq(tokens.userId, users.id))

    console.log(tokenRec)

    if (!tokenRec || !tokenRec.users) {
      return Response.json({ error: "Invalid Token" }, { status: 404 })
    }
    if (tokenRec.tokens.usedAt) {
      return Response.json({ error: "Token already used" }, { status: 410 })
    }

    if (tokenRec.tokens.expiresAt.getTime() < Date.now()) {
      return Response.json({ error: "Token is Expired" }, { status: 410 })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, tokenRec.users.id))

    if (!user) {
      return Response.json(
        { error: "User with this Token does not exist" },
        { status: 404 }
      )
    }
    db.transaction(async (tx) => {
      await tx.update(users).set({ password: hashedPassword })
      await tx.update(tokens).set({ usedAt: new Date() })
    })
    return Response.json(
      {
        message: "Password Reset successfully",
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  console.log(token, "token exists")

  if (!token) return Response.json({ error: "Token required" }, { status: 400 })

  const hashed = TokenUtil.hashToken(token)
  console.log(hashed, "hashedToken")
  const [found] = await db.select().from(tokens).where(eq(tokens.token, hashed))

  if (!found) return Response.json({ error: "Invalid token" }, { status: 410 })
  if (found.usedAt)
    return Response.json({ error: "Token already used" }, { status: 410 })
  if (found.expiresAt < new Date())
    return Response.json({ error: "Token expired" }, { status: 410 })

  return Response.json({ valid: true }, { status: 200 })
}
