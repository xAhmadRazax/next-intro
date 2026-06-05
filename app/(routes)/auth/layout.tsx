import { JWT } from "@/lib/JWT.server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookiesStore = await cookies()
  const token = cookiesStore.get("token")?.value
  if (token) {
    const payload = await JWT.safeVerifyJWT(token)
    if (payload) {
      redirect("/dashboard/profile")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      {children}
    </main>
  )
}
