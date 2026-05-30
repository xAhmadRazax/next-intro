"use client"

import { updateCompany } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { AddCompanyDTO } from "@/types/dashboard.types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function useUpdateCompanyMutation() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{
    message: string
    fields?: Record<string, string>
  } | null>(null)

  async function updateCompanyMutation(
    id: string,
    body: Partial<AddCompanyDTO>,
    onSuccessCallback?: () => void
  ) {
    setIsLoading(true)
    try {
      await updateCompany(id, body)
      onSuccessCallback?.()
      router.refresh()
    } catch (error) {
      if (error instanceof ApiError) {
        setError({ message: error.message, fields: error?.fields })
        toast.error(error.message)
      } else {
        setError({
          message: "something went wrong while adding new company.",
        })
        toast.error("something went wrong while adding new company.")
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
    updateCompanyMutation,
    clearFieldError,
    isLoading,
    error,
  }
}
