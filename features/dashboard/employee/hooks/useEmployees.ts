"use client"
import { getEmployeesQueryOptions } from "@/queries/employee.query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export function useEmployees() {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const emailFilter = searchParams?.get("email") ?? ""
  const usernameFilter = searchParams?.get("username") ?? ""
  const companyFilter = searchParams?.get("company") ?? ""

  const {
    data,
    isPending: isLoading,
    error,
    refetch,
    isRefetching,
  } = useSuspenseQuery(
    getEmployeesQueryOptions({
      page,
      emailFilter,
      usernameFilter,
      companyFilter,
    })
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
