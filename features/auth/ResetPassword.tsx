"use client"

import Form from "@/components/form/Form"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useResetPassword } from "./hooks/useResetPassword"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import Link from "next/link"

export function ResetPassword({ token }: { token: string }) {
  const { resetPasswordHandler, isLoading, error, isSuccess } =
    useResetPassword()
  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const newPassword = data.get("new-password")?.toString()
    const confirmPassword = data.get("confirm-password")?.toString()

    if (!newPassword || !confirmPassword) {
      return alert("Please fill in all fields")
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match")
    }

    await resetPasswordHandler({ token, password: newPassword })

    if (isSuccess) {
      redirect("/auth/login")
    }
  }
  return (
    <Card
      className={`min-w-11/12 sm:min-w-100 ${isLoading ? "animate-plus" : ""}`}
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          <h1>Reset password</h1>
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
          id="reset-password-form"
          className="mt-8 space-y-6"
        >
          <Form.Field className="flex flex-col gap-1.5">
            <Form.Label htmlFor="new-password">New password</Form.Label>
            <Form.Input
              id="new-password"
              name="new-password"
              type="password"
              placeholder="••••••••"
            />
          </Form.Field>
          <Form.Field className="flex flex-col gap-1.5">
            <Form.Label htmlFor="confirm-password">
              Confirm new password
            </Form.Label>
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
          form="reset-password-form"
          className={"w-full text-center"}
        >
          Reset Password
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
