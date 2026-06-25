import { db } from "@/db"
import { projects } from "@/db/schema"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"

export const GET = RouteGuard.requireAuthWithRole(
  async (req) => {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 20)

    const offset = (page - 1) * limit
    try {
      const projects = await db.query.projects.findMany({
        orderBy: (fields, { desc }) => [desc(fields.createdAt)],
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
        limit,
        offset,
      })

      return Response.json(projects, { status: 200 })
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
  ["admin"]
)

export const POST = RouteGuard.requireAuthWithRole(
  async (req) => {
    try {
      const { name, description, projectManagerId, startDate, endDate } =
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
      if (projectManagerId) {
        fields.name = "Project Manager is Required."
      }

      if (Object.keys(fields).length > 0) {
        return Response.json(
          { error: "Missing required fields", fields },
          { status: 400 }
        )
      }

      const authReq = req as AuthReqType

      const user = authReq.user

      const [project] = await db
        .insert(projects)
        .values({
          name,
          description,
          startDate,
          endDate,
          owner: user.id,
          projectManager: projectManagerId,
        })
        .returning()

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
  ["admin"]
)
