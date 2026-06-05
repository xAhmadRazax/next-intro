import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SetUpPassword } from "@/features/auth/setup-password"
import { isSetupAccountPasswordTokenValid } from "@/lib/auth-api"

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { isTokenValid } = await isSetupAccountPasswordTokenValid(token)
  // console.log("is token valid?", isTokenValid)

  if (!isTokenValid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid or Expired Token</CardTitle>
        </CardHeader>
        <CardContent>
          The link you used is either invalid or has expired. Please request a
          new password setup link by contacting support for assistance.
        </CardContent>
      </Card>
    )
  }

  return <SetUpPassword token={token} />
}
