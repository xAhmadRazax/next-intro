"use client"

import { PublicUserType } from "@/db/schema"
import { getEmployees } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { PaginationMeta } from "@/types/pagination.types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const useEmployeesQuery = () => {
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setIsError] = useState("")
  const [employees, setEmployees] = useState<{
    employees: PublicUserType[]
    meta: PaginationMeta
  } | null>()

  const employeesQueryHandler = async ({ page = 1 }: { page?: number }) => {
    setIsLoading(true)

    try {
      const res = await getEmployees({ page })
      setEmployees({ employees: res.data, meta: res.meta })
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
        setIsError(error.message)
        setEmployees({
          employees: [],
          meta: {
            nextPage: null,
            prevPage: null,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
            currentPage: 1,
            itemsPerPage: 20,
          },
        })
      } else {
        setIsError("Something went wrong while fetching data")
        toast.error("Something went wrong while fetching data")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const employeesQueryHandler = async ({
      pageFilter = 1,
      nameFilter = "",
      emailFilter = "",
      companyFilter = "",
      signal,
    }: {
      signal?: AbortSignal
      pageFilter?: number
      nameFilter?: string
      emailFilter?: string
      companyFilter?: string
    }) => {
      // const isMounted = true

      setIsLoading(true)
      try {
        const res = await getEmployees(
          {
            page: pageFilter,
            usernameFilter: nameFilter,
            emailFilter,
            companyFilter,
          },
          signal
        )
        setEmployees({ employees: res.data, meta: res.meta })
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        if (error instanceof ApiError) {
          toast.error(error.message)
          setIsError(error.message)
        } else {
          setIsError("Something went wrong while fetching data")
          toast.error("Something went wrong while fetching data")
        }
      } finally {
        // if (isMounted)
        setIsLoading(false)
      }
    }

    const controller = new AbortController()
    const pageFilter = Number(searchParams.get("page"))
    const emailFilter = searchParams.get("email") ?? undefined
    const nameFilter = searchParams.get("username") ?? undefined
    const companyFilter = searchParams.get("company") ?? undefined

    employeesQueryHandler({
      pageFilter,
      emailFilter,
      companyFilter,
      nameFilter,
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [searchParams])

  return { employeesQueryHandler, isLoading, error, employees }
}
