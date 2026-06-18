import { db } from "@/db"
import { tokens, users } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { TokenUtil } from "@/lib/token.server"
import { and, eq } from "drizzle-orm"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { password } = await req.json()

    if (!token)
      return Response.json({ error: "Token required" }, { status: 400 })

    const hashedToken = TokenUtil.hashToken(token)
    const [tokenRecord] = await db
      .select()
      .from(tokens)
      .where(and(eq(tokens.token, hashedToken), eq(tokens.type, "invite")))

    if (!tokenRecord) {
      return Response.json({ error: "Invalid Token" }, { status: 404 })
    }

    if (tokenRecord.usedAt) {
      return Response.json({ error: "Token already used" }, { status: 410 })
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      return Response.json({ error: "Token is Expired" }, { status: 410 })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, tokenRecord.userId))

    if (!user) {
      return Response.json(
        { error: "User with this Token does not exist" },
        { status: 404 }
      )
    }

    if (!password) {
      return Response.json(
        {
          error: "Missing required fields.",
          fields: { password: "Password is required." },
        },
        { status: 400 }
      )
    }

    const hashedPassword = await TokenUtil.hashPassword(password)

    await db.transaction(async (tx) => {
      await tx.update(users).set({ password: hashedPassword })
      await tx.update(tokens).set({ usedAt: new Date() })
    })

    return Response.json({ status: 204 })
  } catch (error) {
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token)
      return Response.json({ error: "Token required" }, { status: 400 })
    const hashedToken = TokenUtil.hashToken(token)

    console.log(hashedToken, "hashedToken----------------------------->")

    const [tokenRecord] = await db
      .select()
      .from(tokens)
      .where(and(eq(tokens.token, hashedToken), eq(tokens.type, "invite")))

    if (!tokenRecord) {
      return Response.json({ error: "Invalid Token" }, { status: 404 })
    }

    if (tokenRecord.usedAt) {
      return Response.json({ error: "Token already used" }, { status: 410 })
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      return Response.json({ error: "Token is Expired" }, { status: 410 })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, tokenRecord.userId))

    if (!user) {
      return Response.json(
        { error: "User with this Token does not exist" },
        { status: 404 }
      )
    }

    return Response.json({ status: 204 })
  } catch (error) {
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
