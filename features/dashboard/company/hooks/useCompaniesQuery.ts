"use client"

import { CompanyType } from "@/db/schema"
import { getCompanies } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { PaginationMeta } from "@/types/pagination.types"
import { useEffect, useState } from "react"

export const useCompaniesQuery = (page: number = 1) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setIsError] = useState("")
  const [companies, setCompanies] = useState<{
    companies: CompanyType[]
    meta: PaginationMeta
  }>({
    companies: [],
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

  const companiesQueryHandler = async ({ page = 1 }: { page?: number }) => {
    setIsLoading(true)
    try {
      const res = await getCompanies({ page })
      setCompanies({ companies: res.data, meta: res.meta })
    } catch (error) {
      if (error instanceof ApiError) {
        setIsError(error.message)
      } else setIsError("Something went wrong while fetching data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const companiesQueryHandler = async ({
      page = 1,
      signal,
    }: {
      signal?: AbortSignal
      page?: number
    }) => {
      setIsLoading(true)
      try {
        const res = await getCompanies({ page }, signal)
        setCompanies({ companies: res.data, meta: res.meta })
      } catch (error) {
        if (error instanceof ApiError) {
          setIsError(error.message)
        } else setIsError("Something went wrong while fetching data")
      } finally {
        setIsLoading(false)
      }
    }

    const controller = new AbortController()
    companiesQueryHandler({ page, signal: controller.signal })

    return () => controller.abort()
  }, [page])

  return { companiesQueryHandler, isLoading, error, companies }
}
