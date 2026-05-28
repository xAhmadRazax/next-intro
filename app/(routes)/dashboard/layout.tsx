import { DashboardLayout } from "@/features/dashboard/components/Layout"
import { JWT } from "@/lib/JWT.server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

export default async function Layout({ children }: PropsWithChildren) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) {
    redirect("/auth/login")
  }

  const payload = await JWT.safeVerifyJWT(token)
  if (!payload) {
    redirect("/auth/login")
  }

  const isAdmin = payload.role === "admin"
  return <DashboardLayout isAdmin={isAdmin}>{children}</DashboardLayout>
}
