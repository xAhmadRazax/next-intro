import { db } from "@/db"
import { companies, users } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"

export const PATCH = RouteGuard.requireAuthWithRole(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
  ) => {
    const { id } = await params
    const formData = await req.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const logo = formData.get("logo") as File

    // Track uploaded logo for cleanup if error occurs
    // let uploadedLogo: { url: string; publicId: string } | null = null

    try {
      // Validate required fields
      const fields: Record<string, string> = {}
      if (!email) fields.email = "Email is required"
      if (!name) fields.name = "Name is required"
      if (!address) fields.address = "Address is required"

      if (Object.keys(fields).length > 0) {
        return Response.json(
          { error: "Missing required fields", fields },
          { status: 400 }
        )
      }

      // Check if company exists
      const [existingCompany] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, id))

      if (!existingCompany) {
        return Response.json({ error: "Company not found" }, { status: 404 })
      }

      // Find the associated user
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.companyId, id))

      // Prepare update data
      const companyUpdateData: Partial<typeof companies.$inferInsert> = {
        updatedAt: new Date(),
      }
      const userUpdateData: Partial<typeof users.$inferInsert> = {}

      // Company fields
      if (address) {
        companyUpdateData.address = address
      }

      // Handle logo upload if provided
      if (logo instanceof File && logo.size > 0) {
        // const cloudinaryRes = await cloudinaryService.streamUpload(logo);
        // uploadedLogo = {
        //   url: cloudinaryRes.secure_url,
        //   publicId: cloudinaryRes.public_id,
        // };
        // companyUpdateData.logo = cloudinaryRes.secure_url;
        // companyUpdateData.logoPublicId = cloudinaryRes.public_id;
      }

      // User fields (only if changed)
      if (name && name !== existingUser?.name) {
        userUpdateData.name = name
        companyUpdateData.name = name
      }
      if (email && email !== existingUser?.email) {
        userUpdateData.email = email
        companyUpdateData.email = email
      }
      if (Object.keys(userUpdateData).length > 0) {
        userUpdateData.updatedAt = new Date()
      }

      // Update company first
      const [updatedCompany] = await db
        .update(companies)
        .set(companyUpdateData)
        .where(eq(companies.id, id))
        .returning()

      // Update user if there are changes
      let updatedUser = existingUser
      if (Object.keys(userUpdateData).length > 0 && existingUser) {
        ;[updatedUser] = await db
          .update(users)
          .set(userUpdateData)
          .where(eq(users.id, existingUser.id))
          .returning()
      }

      // If both updates succeeded, delete old logo
      // if (existingCompany.logoPublicId && uploadedLogo) {
      //   await cloudinaryService.deleteFromCloudinary(existingCompany.logoPublicId);
      // }

      return Response.json(
        {
          company: updatedCompany,
          user: updatedUser,
          message: "Company updated successfully",
        },
        { status: 200 }
      )
    } catch (err: unknown) {
      // Clean up uploaded logo if error occurred
      // if (uploadedLogo) {
      //   await cloudinaryService.deleteFromCloudinary(uploadedLogo.publicId);
      // }

      // Handle PostgreSQL errors
      const postgresError = handlePostgresError(err)
      if (postgresError) return postgresError

      // Handle duplicate email error
      if (err instanceof Error && err.message.includes("duplicate key")) {
        return Response.json(
          { error: "Email already exists in the system" },
          { status: 409 }
        )
      }

      // Everything else
      console.error("Error updating company:", err)
      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  [`admin`]
)
export const DELETE = RouteGuard.requireAuthWithRole(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
  ) => {
    try {
      const { id } = await params

      const authReq = req as AuthReqType
      const user = authReq.user

      const targetCompany = await db.query.users.findFirst({
        where: and(eq(users.companyId, id), eq(users.role, "company")),
      })

      if (!targetCompany?.id) {
        return Response.json(
          { error: "Employee Doesn't exist" },
          { status: 404 }
        )
      }

      if (
        user.role === "company" &&
        targetCompany.companyId !== user.companyId
      ) {
        return Response.json(
          { error: "Unauthorized: Insufficient permissions" },
          { status: 403 }
        )
      }

      const [deletedCompany] = await db
        .delete(companies)
        .where(eq(companies.id, id))
        .returning()

      if (!deletedCompany) {
        return Response.json({ error: "Company not found" }, { status: 404 })
      }

      //   delete image
      //   if (deletedCompany.logoPublicId)
      //     await cloudinaryService.deleteFromCloudinary(
      //       deletedCompany.logoPublicId
      //     )

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
