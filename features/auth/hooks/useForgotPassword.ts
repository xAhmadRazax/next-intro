"use client"
import { useState } from "react"

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const forgotPasswordHandler = async (email: string) => {
    setIsLoading(true)
    setError(null)

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setIsSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error)
    }

    setIsLoading(false)
  }

  return { forgotPasswordHandler, isLoading, isSuccess, error }
}
