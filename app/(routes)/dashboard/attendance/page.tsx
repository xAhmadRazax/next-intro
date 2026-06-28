import { JWT } from "@/lib/JWT.server"
import { EmployeeAttendanceView } from "@/views/EmployeeAttendance,view"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) {
    redirect("/auth/login")
  }

  const payload = await JWT.safeVerifyJWT(token)
  if (!payload) {
    redirect("/auth/login")
  }

  const role = payload.role ?? "employee"

  return <EmployeeAttendanceView />
}
