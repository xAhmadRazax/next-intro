"use client"
import Form from "@/components/form/Form"
import { useAuthContext } from "@/context/auth.context"
import Link from "next/link"

export const Login = () => {
  const { login, isLoading } = useAuthContext()

  const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get("email")?.toString()
    const password = data.get("password")?.toString()
    if (!email || !password) {
      return alert("Please fill in all fields")
    }

    login(email, password)
  }

  return (
    <section className="min-w-11/12 rounded-sm bg-primary-foreground p-4 shadow-sm ring shadow-foreground/10 ring-foreground/10 sm:min-w-100">
      <header>
        <h1 className="text-center text-2xl font-bold">Login</h1>
      </header>

      <Form onSubmit={submitHandler} className="mt-8 space-y-6">
        <Form.Field>
          <Form.Label>Email</Form.Label>
          <Form.Input
            name="email"
            type="email"
            placeholder="Enter your email"
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Password</Form.Label>
          <Form.Input
            name="password"
            type="password"
            placeholder="Enter your password"
          />
        </Form.Field>

        <Form.Submit
          disabled={isLoading}
          type="submit"
          className="mt-6 block w-full"
        >
          Login
        </Form.Submit>

        <div className="mx-auto h-0.5 w-40 bg-accent"></div>
        <Link
          href="/auth/forgot-password"
          className="block text-sm text-primary"
        >
          Forgot your password?
        </Link>
      </Form>
    </section>
  )
}
