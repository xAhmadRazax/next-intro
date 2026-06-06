"use client"
import { CreateCompanyDto } from "@/app/api/dashboard/companies/dtos/createCompanyDto"
import { CompanyType } from "@/db/schema"
import { createCompany } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { useState } from "react"
import { toast } from "sonner"

export function useCreateCompanyMutation() {
  const [error, setError] = useState<{
    message: string
    fields?: Record<string, string>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function createCompanyHandler(
    { email, logo, name, address }: CreateCompanyDto,
    onSuccessCallbackHandler?: (company: CompanyType) => void
  ) {
    setIsLoading(true)
    try {
      const company = await createCompany({ email, logo, name, address })
      if (company.id) {
        onSuccessCallbackHandler?.(company)
      }
    } catch (error) {
      console.log(error instanceof ApiError)
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

  return { error, clearFieldError, isLoading, createCompanyHandler }
}
