import { db } from "@/db"
import { companies } from "@/db/schema"
import { eq } from "drizzle-orm"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { cloudinaryService } from "@/lib/cloudinary.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { PERMISSIONS } from "@/lib/permissions"

export const PATCH = RouteGuard.requireAuthWithPermission(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
  ) => {
    // Await params if it's a Promise (Next.js 15+)
    const { id } = await params
    const formData = await req.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const logo = formData.get("logo") as File

    let logoObj: { url: string; public_Id: string } | null = null

    try {
      if (!name && !email && !address && !logo) {
        return Response.json({ status: 200 })
      }

      const [companyToUpdate] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, id))

      if (!companyToUpdate) {
        return Response.json({ error: "Company not found" }, { status: 404 })
      }

      if (logo instanceof File) {
        const cloudinaryRes = await cloudinaryService.streamUpload(logo)
        logoObj = {
          url: cloudinaryRes.secure_url,
          public_Id: cloudinaryRes.public_id,
        }
      }

      const companyUpdateData: {
        name?: string
        email?: string
        address?: string
        logo?: string
        logoPublicId?: string
      } = {}

      if (name) {
        companyUpdateData.name = name
      }
      if (email) {
        companyUpdateData.email = email
      }
      if (address) {
        companyUpdateData.address = address
      }

      if (logoObj?.public_Id && logoObj.url) {
        companyUpdateData.logo = logoObj.url
        companyUpdateData.logoPublicId = logoObj.public_Id
      }

      const [company] = await db
        .update(companies)
        .set(companyUpdateData)
        .where(eq(companies.id, id))
        .returning()

      if (companyToUpdate.logoPublicId && logoObj?.url) {
        await cloudinaryService.deleteFromCloudinary(
          companyToUpdate.logoPublicId
        )
      }

      return Response.json(company, { status: 200 })
    } catch (err: unknown) {
      if (logoObj?.public_Id) {
        await cloudinaryService.deleteFromCloudinary(logoObj.public_Id)
      }
      const postgresError = handlePostgresError(err)
      if (postgresError) return postgresError

      // Everything else
      console.error(err)
      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  PERMISSIONS.COMPANY.UPDATE,
  async (_req, context) => {
    const { id } = await context.params

    return {
      targetCompanyId: id,
    }
  }
)

export const DELETE = RouteGuard.requireAuthWithPermission(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
  ) => {
    try {
      const { id } = await params

      const [deletedCompany] = await db
        .delete(companies)
        .where(eq(companies.id, id))
        .returning()

      if (!deletedCompany) {
        return Response.json({ error: "Company not found" }, { status: 404 })
      }

      if (deletedCompany.logoPublicId)
        await cloudinaryService.deleteFromCloudinary(
          deletedCompany.logoPublicId
        )

      return new Response(null, { status: 204 })
    } catch (err: unknown) {
      const postgresError = handlePostgresError(err)
      if (postgresError) return postgresError

      console.error(err)
      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  PERMISSIONS.COMPANY.DELETE,
  async (_req, context) => {
    const { id } = await context.params

    return {
      targetCompanyId: id,
    }
  }
)
