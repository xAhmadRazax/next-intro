"use client"
import { addEmployee } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { AddEmployeeDTO } from "@/types/dashboard.types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function useCreateEmployeeMutation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [error, setError] = useState<{
    message: string
    fields?: Record<string, string>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function createEmployeeHandler(
    { email, username, avatar, companyId }: AddEmployeeDTO,
    onSuccessCallbackHandler?: () => void
  ) {
    setIsLoading(true)
    try {
      const newEmployee = await addEmployee({
        email,
        username,
        avatar,
        companyId,
      })

      // startTransition(() => {
      // router.push("/dashboard/employees") // only if you need to navigate away
      // router.refresh() // this re-runs server components & refetches data
      // })

      onSuccessCallbackHandler?.()
      router.refresh()
      // const params = new URLSearchParams(searchParams)
      // router.push("/dashboard/employees")
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
