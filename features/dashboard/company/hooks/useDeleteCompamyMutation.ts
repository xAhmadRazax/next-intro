"use client"
import { deleteCompany } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { useState } from "react"
import { toast } from "sonner"

export function useDeleteCompanyMutation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function deleteCompanyHandler(
    id: string,
    onSuccessCallback?: () => void
  ) {
    setIsLoading(true)
    try {
      await deleteCompany(id)
      onSuccessCallback?.()
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
        toast.error(error.message)
      } else {
        setError("something went wrong while adding new company.")
        toast.error("something went wrong while adding new company.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    deleteCompanyHandler,
  }
}
