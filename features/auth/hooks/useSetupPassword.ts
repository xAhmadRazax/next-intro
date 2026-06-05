"use client"
import { useState } from "react"

export const useSetupPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setupPasswordHandler = async ({
    token,
    password,
  }: {
    token: string
    password: string
  }) => {
    setIsLoading(true)
    setError(null)

    const res = await fetch(`/api/auth/set-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      return { isSuccess: true }
    } else {
      const data = await res.json()
      setError(data.error)
    }

    setIsLoading(false)
    return { isSuccess: false }
  }

  return { setupPasswordHandler, isLoading, error }
}
