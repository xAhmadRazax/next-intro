"use client"
import { PublicUserType } from "@/db/schema"
import { addEmployee } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { AddEmployeeDTO } from "@/types/dashboard.types"
import { useState } from "react"
import { toast } from "sonner"

export function useCreateEmployeeMutation() {
  const [error, setError] = useState<{
    message: string
    fields?: Record<string, string>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function createEmployeeHandler(
    { email, username, avatar, companyId }: AddEmployeeDTO,
    onSuccessCallbackHandler?: (employee: PublicUserType) => void
  ) {
    setIsLoading(true)
    try {
      const newEmployee = await addEmployee({
        email,
        username,
        avatar,
        companyId,
      })

      if (newEmployee.id) onSuccessCallbackHandler?.(newEmployee)
    } catch (error) {
      console.log(error instanceof ApiError)
      if (error instanceof ApiError) {
        setError({ message: error.message, fields: error?.fields })
        toast.error(error.message)
      } else {
        setError({
          message: "something went wrong while adding new employee.",
        })
        toast.error("something went wrong while adding new employee.")
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
    error,
    clearFieldError,
    isLoading,
    createEmployeeHandler,
  }
}
