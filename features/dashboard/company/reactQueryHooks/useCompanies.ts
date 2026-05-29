"use client"
import { getCompaniesQueryOptions } from "@/queries/company.query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export function useCompanies(getAll = false) {
  const searchParams = useSearchParams()
  const page = Number(searchParams?.get("page") ?? 1)
  const emailFilter = searchParams?.get("email") ?? ""
  const nameFilter = searchParams?.get("name") ?? ""

  const {
    data,
    isPending: isLoading,
    error,
    refetch,
    isRefetching,
  } = useSuspenseQuery(
    getCompaniesQueryOptions({ emailFilter, nameFilter, page, getAll })
  )

  return {
    data,
    meta: data?.meta,
    isLoading,
    error,
    page,
    refetch,
    isRefetching,
  }
}
