import { RouteGuard } from "@/lib/routeGuard.server"

export const PATCH = RouteGuard.requireAuth(async (req: Request) => {
  try {
    return Response.json({}, {})
  } catch (error) {
    return Response.json({}, {})
  }
})
