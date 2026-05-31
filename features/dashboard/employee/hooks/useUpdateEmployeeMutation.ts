"use client"

import { updateEmployee } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { updateEmployeeDto } from "@/types/dashboard.types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function useUpdateEmployeeMutation() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{
    message: string
    fields?: Record<string, string>
  } | null>(null)

  async function updateEmployeeMutation(
    id: string,
    body: Partial<updateEmployeeDto>,
    onSuccessCallback?: () => void
  ) {
    setIsLoading(true)
    try {
      await updateEmployee(id, body)
      onSuccessCallback?.()
      router.refresh()
    } catch (error) {
      if (error instanceof ApiError) {
        setError({ message: error.message, fields: error?.fields })
        toast.error(error.message)
      } else {
        setError({
          message: "something went wrong while updating employee.",
        })
        toast.error("something went wrong while updating employee.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearFieldError = (field: string) => {
    setError((prev) => {
      if (!prev) return null
      const fields = { ...prev.fields }
      delete fields[field]
      return { ...prev, fields }
    })
  }

  return {
    updateEmployeeMutation,
    clearFieldError,
    isLoading,
    error,
  }
}
