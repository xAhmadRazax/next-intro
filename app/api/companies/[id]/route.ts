import { db } from "@/db"
import { companies } from "@/db/schema"
import { CreateCompanyDto } from "../dtos/createCompanyDto"
import { eq } from "drizzle-orm"
import { handlePostgresError } from "@/lib/drizzle-error-handler"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const { id } = await params

    const body = (await req.json()) as Partial<CreateCompanyDto>
    const { name, email, address, logo } = body

    if (!name && !email && !address && !logo) {
      return Response.json({ error: "No fields to update" }, { status: 400 })
    }

    const [company] = await db
      .update(companies)
      .set({ name, email, address, logo })
      .where(eq(companies.id, id))
      .returning()

    if (!company) {
      return Response.json({ error: "Company not found" }, { status: 404 })
    }

    return Response.json(company, { status: 200 })
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

    const [deletedCompany] = await db
      .delete(companies)
      .where(eq(companies.id, id))
      .returning()

    if (!deletedCompany) {
      return Response.json({ error: "Company not found" }, { status: 404 })
    }

    return new Response(null, { status: 204 })
  } catch (err: unknown) {
    const postgresError = handlePostgresError(err)
    if (postgresError) return postgresError

    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
