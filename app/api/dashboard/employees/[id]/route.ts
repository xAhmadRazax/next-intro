import { db } from "@/db"
import { employees, users } from "@/db/schema"
import { eq, and, ne } from "drizzle-orm"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { cloudinaryService } from "@/lib/cloudinary.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"

export const PATCH = RouteGuard.requireAuthWithRole(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const formData = await req.formData()

    try {
      // Guard: ensure if auth user access this
      const authReq = req as AuthReqType
      const user = authReq.user

      const targetUser = await db.query.users.findFirst({
        where: and(eq(users.employeeId, id), ne(users.role, "admin")),
      })

      if (!targetUser?.id) {
        return Response.json(
          { error: "Employee Doesn't exist" },
          { status: 404 }
        )
      }

      if (user.role === "company" && targetUser.companyId !== user.companyId) {
        return Response.json(
          { error: "Unauthorized: Insufficient permissions" },
          { status: 403 }
        )
      }

      if (
        authReq.user.role === "employee" &&
        targetUser.employeeId !== authReq.user.companyId
      ) {
        return Response.json(
          { error: "Unauthorized: Insufficient permissions" },
          { status: 403 }
        )
      }

      const name = formData.get("name") as string
      const email = formData.get("email") as string
      const address = formData.get("address") as string
      const phone = formData.get("phone") as string
      const designation = formData.get("designation") as string
      const avatar = formData.get("avatar") as File

      // let avatarObj: { url: string; avatarPublicId: string } | null = null

      if (!name && !email && !address && !phone && designation) {
        return Response.json({ error: "No fields to update" }, { status: 400 })
      }

      const [employeeToUpdate] = await db
        .select()
        .from(users)
        .where(and(eq(users.id, id), ne(users.role, "admin")))

      if (!employeeToUpdate) {
        return Response.json({ error: "employee not found" }, { status: 404 })
      }

      // if (avatar instanceof File) {
      //   const cloudinaryRes = await cloudinaryService.streamUpload(avatar)

      //   avatarObj = {
      //     avatarPublicId: cloudinaryRes.public_id,
      //     url: cloudinaryRes.secure_url,
      //   }
      // }

      const userUpdateData: Partial<typeof users.$inferInsert> = {}
      const employeeUpdateData: Partial<typeof employees.$inferInsert> = {}

      // const employeeUpdateData: {
      //   username: string
      //   email: string
      //   avatar?: string
      //   avatarPublicId?: string
      // } = {
      //   username,
      //   email,
      // // }
      // if (avatarObj?.url && avatarObj?.avatarPublicId) {
      //   employeeUpdateData.avatar = avatarObj.url
      //   employeeUpdateData.avatarPublicId = avatarObj.avatarPublicId
      // }

      if (name) {
        userUpdateData.name = name
        employeeUpdateData.name = name
      }
      if (email) {
        userUpdateData.email = email
        employeeUpdateData.email = email
      }
      if (address) {
        employeeUpdateData.address = address
      }
      if (designation) {
        employeeUpdateData.designation = designation
      }
      if (phone) {
        employeeUpdateData.phone = phone
      }

      const [updatedUser] = await db
        .update(users)
        .set(userUpdateData)
        .where(and(eq(users.employeeId, id), ne(users.role, "admin")))
        .returning()

      const [employee] = await db
        .update(employees)
        .set(employeeUpdateData)
        .where(eq(employees.id, id))
        .returning()

      // if (employeeToUpdate.avatarPublicId) {
      //   await cloudinaryService.deleteFromCloudinary(
      //     employeeToUpdate.avatarPublicId
      //   )
      // }

      return Response.json(
        {
          id: employee.id,
          name: updatedUser.name,
          email: updatedUser.email,
          address: employee.address,
          designation: employee.designation,
          role: updatedUser.role,
          phone: employee.phone,
          avatar: employee.avatar,
        },
        { status: 200 }
      )
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
  },
  ["admin", "employee", "company"]
)

export const DELETE = RouteGuard.requireAuthWithRole(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params

      const authReq = req as AuthReqType
      const user = authReq.user

      const targetUser = await db.query.users.findFirst({
        where: and(eq(users.employeeId, id), ne(users.role, "admin")),
      })

      if (!targetUser?.id) {
        return Response.json(
          { error: "Employee Doesn't exist" },
          { status: 404 }
        )
      }

      if (user.role === "company" && targetUser.companyId !== user.companyId) {
        return Response.json(
          { error: "Unauthorized: Insufficient permissions" },
          { status: 403 }
        )
      }

      if (
        authReq.user.role === "employee" &&
        targetUser.employeeId !== authReq.user.companyId
      ) {
        return Response.json(
          { error: "Unauthorized: Insufficient permissions" },
          { status: 403 }
        )
      }

      const [deletedEmployee] = await db
        .delete(employees)
        .where(eq(employees.id, id))
        .returning()

      if (!deletedEmployee) {
        return Response.json({ error: "Employees not found" }, { status: 404 })
      }
      // if (deletedEmployee.avatarPublicId)
      //   await cloudinaryService.deleteFromCloudinary(
      //     deletedEmployee.avatarPublicId
      //   )
      return new Response(null, { status: 204 })
    } catch (err: unknown) {
      console.log(err)
      const postgresError = handlePostgresError(err)
      if (postgresError) return postgresError

      console.error(err)
      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin", "company"]
)
