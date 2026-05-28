import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, and, ne } from "drizzle-orm"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { cloudinaryService } from "@/lib/cloudinary.server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const formData = await req.formData()

  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const avatar = formData.get("avatar") as File

  let avatarObj: { url: string; avatarPublicId: string } | null = null
  try {
    if (!username && !email) {
      return Response.json({ error: "No fields to update" }, { status: 400 })
    }

    const [employeeToUpdate] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), ne(users.role, "admin")))

    if (!employeeToUpdate) {
      return Response.json({ error: "employee not found" }, { status: 404 })
    }

    if (avatar instanceof File) {
      const cloudinaryRes = await cloudinaryService.streamUpload(avatar)

      avatarObj = {
        avatarPublicId: cloudinaryRes.public_id,
        url: cloudinaryRes.secure_url,
      }
    }

    const employeeUpdateData: {
      username: string
      email: string
      avatar?: string
      avatarPublicId?: string
    } = {
      username,
      email,
    }
    if (avatarObj?.url && avatarObj?.avatarPublicId) {
      employeeUpdateData.avatar = avatarObj.url
      employeeUpdateData.avatarPublicId = avatarObj.avatarPublicId
    }

    const [employee] = await db
      .update(users)
      .set(employeeUpdateData)
      .where(eq(users.id, id))
      .returning()

    if (employeeToUpdate.avatarPublicId) {
      await cloudinaryService.deleteFromCloudinary(
        employeeToUpdate.avatarPublicId
      )
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [deletedEmployee] = await db
      .delete(users)
      .where(and(eq(users.id, id), ne(users.role, "admin")))
      .returning()

    if (!deletedEmployee) {
      return Response.json({ error: "Employees not found" }, { status: 404 })
    }
    if (deletedEmployee.avatarPublicId)
      await cloudinaryService.deleteFromCloudinary(
        deletedEmployee.avatarPublicId
      )
    return new Response(null, { status: 204 })
  } catch (err: unknown) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
