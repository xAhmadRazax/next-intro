import { cookies } from "next/headers"
import { JWT } from "./JWT.server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

type Handler<TContext = undefined> = (
  req: Request,
  context: TContext
) => Promise<Response>

export class RouteGuard {
  static requireAuth<TContext>(handler: Handler<TContext>): Handler<TContext> {
    return async (req, context) => {
      const cookiesStore = await cookies()
      const token = cookiesStore.get("token")?.value

      if (!token) {
        cookiesStore.delete("token")
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const payload = await JWT.safeVerifyJWT(token)

      if (!payload) {
        cookiesStore.delete("token")
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.id))

      if (!user) {
        cookiesStore.delete("token")
        return Response.json(
          { error: "user with this id no longer exists." },
          { status: 404 }
        )
      }
      return handler(req, context)
    }
  }

  static requireAuthWithRole<TContext>(
    handler: Handler<TContext>,
    roles: string[]
  ): Handler<TContext> {
    return async (req, context) => {
      const cookiesStore = await cookies()
      const token = cookiesStore.get("token")?.value

      if (!token) {
        cookiesStore.delete("token")
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const payload = await JWT.safeVerifyJWT(token)

      if (!payload) {
        cookiesStore.delete("token")
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.id))

      if (!user) {
        cookiesStore.delete("token")
        return Response.json(
          { error: "user with this id no longer exists." },
          { status: 404 }
        )
      }

      if (!user.role || !roles.includes(user.role)) {
        return Response.json(
          {
            error: "You do not have permission to view this resource.",
          },
          { status: 403 }
        )
      }

      return handler(req, context)
    }
  }
}
