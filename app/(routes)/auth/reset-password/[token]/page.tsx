import { ResetPassword } from "@/features/auth/ResetPassword"
import { isResetPasswordTokenValid } from "@/lib/auth-api"
import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  if (!token) redirect("/auth/forgot-password?error=invalid_token")

  const { isTokenValid } = await isResetPasswordTokenValid(token)

  if (!isTokenValid) redirect("/auth/forgot-password?error=invalid_token")

  return <ResetPassword token={token} />
}
