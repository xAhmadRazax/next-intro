import { db } from "@/db"
import { projects } from "@/db/schema"
import { projectTasks } from "@/db/schemas/backeup/project-tasks.schema"
import { taskAssignees } from "@/db/schemas/backeup/task-assignees.schema"
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

      const { name, startDate, endDate, description, members } =
        await req.json()
      const fields: Record<string, string> = {}

      if (!name) {
        fields.name = "Name is Required."
      }

      if (!startDate) {
        fields.startDate = "Start Date is Required."
      }
      if (!endDate) {
        fields.endDate = "End Date is Required."
      }

      const [task] = await db
        .insert(projectTasks)
        .values({ name, projectId: id, createdBy: user.id, description })
        .returning()

      if (members.length! > 0) {
        await db.insert(taskAssignees).values(members)
      }

      return Response.json({ task, status: 200 })
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
