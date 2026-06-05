"use client"
import { deleteEmployee } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function useDeleteEmployeeMutation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function deleteEmployeeHandler(
    id: string,
    onSuccessCallback?: () => void
  ) {
    setIsLoading(true)
    try {
      await deleteEmployee(id)
      onSuccessCallback?.()
      const params = new URLSearchParams(searchParams)

      router.push(`${pathname}?${params.toString()}`)
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
    deleteEmployeeHandler,
  }
}
