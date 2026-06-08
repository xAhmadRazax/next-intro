import { cookies } from "next/headers"
import { JWT } from "./JWT.server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { PERMISSION_SCOPE, ROLE_PERMISSIONS } from "./permissions"
import { ScopeExtractor } from "@/types/types.server"

type Handler<TContext = undefined> = (
  req: Request,
  context: TContext
) => Promise<Response>

export class RouteGuard {
  private static hasPermission(role: string, permission: string): boolean {
    // the idea here that we want to check if user role exist in the roles_permission object,

    const roleData = ROLE_PERMISSIONS[role]
    if (!roleData) {
      return false
    }

    return !!(
      // roleData.permissions.find((el) => el.permission === "*") ||
      roleData.permissions.find((el) => el.permission === permission)
    )
  }

  private static getScope(
    role: string,
    permission: string
  ): (typeof PERMISSION_SCOPE)[keyof typeof PERMISSION_SCOPE] {
    return (
      ROLE_PERMISSIONS[role]?.permissions?.find(
        (el) => el.permission === permission
      )?.scope ?? PERMISSION_SCOPE.OWN
    )
  }
  private static isBypassRole(role: string): boolean {
    const permissions = ROLE_PERMISSIONS[role]?.permissions
    if (!permissions || permissions.length === 0) return false
    // every return true if all array elements match the condition
    return (
      ROLE_PERMISSIONS[role]?.permissions.every(
        (el) => el.scope === PERMISSION_SCOPE.ANY
      ) ?? false
    )
  }

  private static canUserAccess({
    user,
    permission,
    targetCompanyId,
    targetUserId,
  }: {
    user: {
      id: string
      role: string
      companyId: string | null
    }
    permission: string
    targetCompanyId?: string
    targetUserId?: string
  }): boolean {
    // 2. bypass role check (optional shortcut)
    if (this.isBypassRole(user.role)) return true

    // 1. permission check (reuse your function)
    const hasPermission = this.hasPermission(user.role, permission)
    if (!hasPermission) return false

    // 3. get scope (reuse your function)
    const scope = this.getScope(user.role, permission)

    // 4. scope evaluation
    switch (scope) {
      case PERMISSION_SCOPE.ANY:
        return true

      case PERMISSION_SCOPE.COMPANY:
        return !!targetCompanyId && user.companyId === targetCompanyId

      case PERMISSION_SCOPE.OWN:
        return !!targetUserId && user.id === targetUserId

      default:
        return false
    }
  }

  static requireAuthWithPermission<TContext>(
    handler: Handler<TContext>,
    permission: string,
    extractTargets?: ScopeExtractor<TContext>
  ): Handler<TContext> {
    return async (req, context) => {
      const cookiesStore = await cookies()
      const token = cookiesStore.get("token")?.value

      // console.log(req, "request")

      if (!token) {
        cookiesStore.delete("token")
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const payload = await JWT.safeVerifyJWT(token)

      if (!payload) {
        cookiesStore.delete("token")
        return Response.json({ error: "Unauthorized access." }, { status: 401 })
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.id),
        with: {
          company: true,
        },
      })

      if (!user) {
        cookiesStore.delete("token")
        return Response.json(
          { error: "user with this id no longer exists." },
          { status: 404 }
        )
      }

      // Only do scope checks if there's something to check
      const targets = extractTargets
        ? await extractTargets(req, context)
        : undefined
      const { targetCompanyId, targetUserId } = targets ?? {}

      if (
        !this.canUserAccess({ user, permission, targetCompanyId, targetUserId })
      ) {
        return Response.json({ error: "Forbidden" }, { status: 403 })
      }
      return handler(req, context)
    }
  }
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
