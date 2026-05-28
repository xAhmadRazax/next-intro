"use client"

import { BASEURL } from "@/constants/constants"
import { useState } from "react"

export function useResetEmployeePassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function resetEmployeePasswordHandler(id: string) {
    setIsLoading(true)
    setError(null)

    console.log("id of employee", id)
    const res = await fetch(
      `${BASEURL}/dashboard/employees/${id}/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
    if (res.ok) {
      setIsSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error)
    }

    setIsLoading(false)
  }

  return { isLoading, error, resetEmployeePasswordHandler }
}
