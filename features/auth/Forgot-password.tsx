"use client"
import Form from "@/components/form/Form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useForgotPassword } from "./hooks/useForgotPassword"
import { useState } from "react"

export const ForgotPassword = ({
  isTokenInvalid = false,
}: {
  isTokenInvalid?: boolean
}) => {
  const { isLoading, forgotPasswordHandler, isSuccess, error } =
    useForgotPassword()

  const [hasInvalidToken, setHasInvalidToken] = useState(() => isTokenInvalid)

  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setHasInvalidToken(false)
    const data = new FormData(e.currentTarget)
    const email = data.get("email")?.toString()
    if (!email) {
      return alert("Please fill in all fields")
    }

    await forgotPasswordHandler(email)
  }

  return (
    <Card className="min-w-11/12 sm:min-w-100">
      <CardTitle>
        <h1 className="text-center text-2xl font-bold">Forgot Password</h1>
      </CardTitle>

      <CardContent>
        {isSuccess && (
          <p className="mb-4 rounded bg-green-100 p-2 text-center text-green-700">
            If an account with that email exists, a reset link has been sent.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">
            {error}
          </p>
        )}

        {hasInvalidToken && (
          <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">
            Invalid or expired token. Please request a new password reset.
          </p>
        )}

        <Form
          id="forgot-password-form"
          onSubmit={submitHandler}
          className="mt-8 space-y-6"
        >
          <Form.Field>
            <Form.Label>Email</Form.Label>
            <Form.Input
              name="email"
              type="email"
              placeholder="Enter your email"
            />
          </Form.Field>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="forgot-password-form"
          disabled={isLoading}
          className={"w-full"}
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
