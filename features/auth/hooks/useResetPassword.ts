"use client"
import { useState } from "react"

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetPasswordHandler = async ({
    token,
    password,
  }: {
    token: string
    password: string
  }) => {
    setIsLoading(true)
    setError(null)

    console.log(token)
    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      setIsSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error)
    }

    setIsLoading(false)
  }

  return { resetPasswordHandler, isLoading, isSuccess, error }
}
