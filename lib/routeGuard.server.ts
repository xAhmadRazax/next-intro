import { cookies } from "next/headers"
import { JWT } from "./JWT.server"

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
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const payload = await JWT.safeVerifyJWT(token)

      if (!payload) {
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
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
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const payload = await JWT.safeVerifyJWT(token)

      if (!payload) {
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      if (!payload.role || !roles.includes(payload.role)) {
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
