import { cookies } from "next/headers"
import { JWT } from "./JWT.server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
// import { AuthReqType } from "@/types/authReq.type"
import { NextResponse } from "next/server"
import { AuthReqType } from "@/types/authReq.type"

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

      if (!payload || !payload.id) {
        const res = NextResponse.json(
          { error: "Unauthorized access." },
          { status: 401 }
        )

        res.cookies.delete("token")

        return res
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.id))

      if (!user) {
        const res = NextResponse.json(
          { error: "user with this id no longer exists." },
          { status: 404 }
        )

        res.cookies.delete("token")

        return res
      }

      const authReq = req as AuthReqType
      authReq.user! = user
      return handler(authReq, context)
    }
  }

  static requireAuthWithRole<TContext>(
    handler: Handler<TContext>,
    roles: string[]
  ): Handler<TContext> {
    return async (req, context) => {
      console.log("guard is being hit ")
      const cookiesStore = await cookies()
      const token = cookiesStore.get("token")?.value

      if (!token) {
        const res = NextResponse.json(
          { error: "Unauthorized access." },
          { status: 401 }
        )

        res.cookies.delete("token")

        return res
      }

      const payload = await JWT.safeVerifyJWT(token)

      if (!payload) {
        const res = NextResponse.json(
          { error: "Unauthorized access." },
          { status: 401 }
        )

        res.cookies.delete("token")

        return res
      }

      // const [user] = await db
      // .select()
      // .from(users)
      // .where(eq(users.id, payload.id))

      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.id),
        with: {
          company: true,
          employee: true,
        },
      })

      if (!user) {
        const res = NextResponse.json(
          { error: "user with this id no longer exists." },
          { status: 404 }
        )

        res.cookies.delete("token")

        return res
      }

      if (!user.role || !roles.includes(user.role)) {
        return Response.json(
          {
            error: "You do not have permission to view this resource.",
          },
          { status: 403 }
        )
      }

      const authReq = req as AuthReqType
      authReq.user = user
      return handler(authReq, context)
    }
  }
}
