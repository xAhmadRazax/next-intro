import { ForgotPassword } from "@/features/auth/Forgot-password"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <ForgotPassword isTokenInvalid={!!error} />
}
