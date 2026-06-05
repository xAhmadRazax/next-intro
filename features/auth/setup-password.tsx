"use client"

import Form from "@/components/form/Form"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSetupPassword } from "./hooks/useSetupPassword"
import { toast } from "sonner"

export function SetUpPassword({ token }: { token: string }) {
  const router = useRouter()

  const { setupPasswordHandler, isLoading, error } = useSetupPassword()
  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const newPassword = data.get("password")?.toString()
    const confirmPassword = data.get("confirm-password")?.toString()

    if (!newPassword || !confirmPassword) {
      return alert("Please fill in all fields")
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match")
    }

    const { isSuccess } = await setupPasswordHandler({
      token,
      password: newPassword,
    })

    console.log(isSuccess, "is success outer")
    if (isSuccess) {
      console.log(isSuccess, "is success")
      router.push("/auth/login")
    } else {
      toast.error(error || "Failed to set password. Please try again.")
    }
  }
  return (
    <Card
      className={`min-w-11/12 sm:min-w-100 ${isLoading ? "animate-plus" : ""}`}
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          <h1>Setup password</h1>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">
            {error}
          </p>
        )}
        <Form
          onSubmit={submitHandler}
          id="setup-password-form"
          className="mt-8 space-y-6"
        >
          <Form.Field className="flex flex-col gap-1.5">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
            />
          </Form.Field>
          <Form.Field className="flex flex-col gap-1.5">
            <Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
            <Form.Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="••••••••"
            />
          </Form.Field>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          disabled={isLoading}
          type="submit"
          form="setup-password-form"
          className={"w-full text-center"}
        >
          {isLoading ? "Setting up..." : "Setup Password"}
        </Button>
        <div className="mx-auto h-0.5 w-40 bg-accent"></div>
        <Link
          href="/auth/login"
          className="block w-full text-left text-sm text-primary"
        >
          Go back to Login page?
        </Link>
      </CardFooter>
    </Card>
  )
}
