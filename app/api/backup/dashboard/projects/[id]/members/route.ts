import { db } from "@/db"
import { projectMembers, projects } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"
import { eq } from "drizzle-orm"

export const POST = RouteGuard.requireAuthWithRole(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params
      const authReq = req as AuthReqType
      const user = authReq.user

      const project = await db.query.projects.findFirst({
        where: eq(projects.id, id),
      })

      if (!project) {
        return Response.json(
          { error: "Project with the given id doesn't exists" },
          { status: 404 }
        )
      }

      if (user.role === "employee" && project?.projectManager !== user.id) {
        return Response.json(
          { error: "You do no have the permission to perform this actions" },
          { status: 403 }
        )
      }

      const [members] = await req.json()

      await db.insert(projectMembers).values([members])
      const assignedMembers = await db.query.projectMembers.findMany({
        where: eq(projectMembers.id, id),
      })
      return Response.json({ members: assignedMembers }, { status: 200 })
    } catch (error) {
      const postgresError = handlePostgresError(error)
      if (postgresError) return postgresError

      // Handle JSON parsing error
      if (error instanceof SyntaxError) {
        return Response.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin", "employee"]
)

export const PATCH = RouteGuard.requireAuthWithRole(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { memberId } = await req.json()
      if (!memberId) {
        return Response.json(
          {
            error: "Missing required fields",
            field: { memberId: "member Id is REquired" },
          },
          { status: 400 }
        )
      }

      const { id } = await params
      const authReq = req as AuthReqType
      const user = authReq.user

      const project = await db.query.projects.findFirst({
        where: eq(projects.id, id),
      })

      if (!project) {
        return Response.json(
          { error: "Project with the given id doesn't exists" },
          { status: 404 }
        )
      }

      if (user.role === "employee" && project?.projectManager !== user.id) {
        return Response.json(
          { error: "You do no have the permission to perform this actions" },
          { status: 403 }
        )
      }

      // await db.insert(projectMembers).values([members])

      await db
        .update(projectMembers)
        .set({
          leftAt: new Date(),
        })
        .where(eq(projectMembers.id, memberId))

      const assignedMembers = await db.query.projectMembers.findMany({
        where: eq(projectMembers.id, id),
      })
      return Response.json({ members: assignedMembers }, { status: 200 })
    } catch (error) {
      const postgresError = handlePostgresError(error)
      if (postgresError) return postgresError

      // Handle JSON parsing error
      if (error instanceof SyntaxError) {
        return Response.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin", "employee"]
)
