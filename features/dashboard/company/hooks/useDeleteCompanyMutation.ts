"use client"
import { deleteCompany } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function useDeleteCompanyMutation() {
  const router = useRouter()
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
      router.refresh()
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
