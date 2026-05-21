import { db } from "@/db"
import { employees } from "@/db/schema"
import { eq } from "drizzle-orm"
import { handlePostgresError } from "@/lib/drizzle-error-handler"
import { UpdateEmployeeDto } from "../dtos/updateEmployee.dto"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const { id } = await params

    const body = (await req.json()) as Partial<UpdateEmployeeDto>
    const { username, email, avatar } = body

    if (!username && !email) {
      return Response.json({ error: "No fields to update" }, { status: 400 })
    }

    const employeeUpdateData = { username, email, avatar }
    if (!avatar) {
      delete employeeUpdateData.avatar
    }

    const [employee] = await db
      .update(employees)
      .set(employeeUpdateData)
      .where(eq(employees.id, id))
      .returning()

    console.log(id, "id")
    if (!employee) {
      return Response.json({ error: "employee not found" }, { status: 404 })
    }

    return Response.json(employee, { status: 200 })
  } catch (err: unknown) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    // Handle JSON parsing error
    if (err instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    // Everything else
    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await params

    const [deletedEmployee] = await db
      .delete(employees)
      .where(eq(employees.id, id))
      .returning()

    if (!deletedEmployee) {
      return Response.json({ error: "Employees not found" }, { status: 404 })
    }

    return new Response(null, { status: 204 })
  } catch (err: unknown) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
