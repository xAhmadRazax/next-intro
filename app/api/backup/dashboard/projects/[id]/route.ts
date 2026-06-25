import { db } from "@/db"
import { projects } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"
import { eq } from "drizzle-orm"

export const GET = RouteGuard.requireAuthWithRole(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params

      const authReq = req as AuthReqType

      const user = authReq.user

      const project = await db.query.projects.findFirst({
        where: eq(projects.id, id),
        with: {
          creator: true,
          manager: true,
          members: {
            with: {
              user: {
                with: { jobTitle: true },
              },
            },
          },
        },
      })

      if (!project?.id) {
        return Response.json(
          { error: "Project with the given id doesn't exists." },
          { status: 404 }
        )
      }
      const isViewingUserMember = project.members.find(
        (el) => el.id === user.id
      )
      if (
        (user.role === "employee" && user.id !== project.manager?.id) ||
        !isViewingUserMember
      ) {
        return Response.json(
          { error: "You do no have the permission to perform this actions" },
          { status: 403 }
        )
      }

      return Response.json({ project }, { status: 200 })
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
  ["admin", "members"]
)

export const PATCH = RouteGuard.requireAuthWithRole(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    try {
      // since i didnt have permission define so all i can do is check user role at this point

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

      const { description, startDate, endDate } = await req.json()

      const fieldToUpdate: Record<string, string> = {}

      if (description) {
        fieldToUpdate.description = description
      }

      if (startDate) {
        fieldToUpdate.startDate = startDate
      }
      if (endDate) {
        fieldToUpdate.endDate = endDate
      }

      let updatedDocs

      if (Object.values(fieldToUpdate).length > 0) {
        const [res] = await db
          .update(projects)
          .set(fieldToUpdate)
          .where(eq(projects.id, id))
          .returning()

        updatedDocs = res
      }

      return Response.json({ project: updatedDocs ?? project, status: 200 })
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
