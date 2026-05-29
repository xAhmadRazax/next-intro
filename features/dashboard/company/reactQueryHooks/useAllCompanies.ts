"use client"
import { getAllCompaniesQueryOptions } from "@/queries/company.query"
import { useQuery } from "@tanstack/react-query"
export function useAllCompanies() {
  const {
    data,
    isPending: isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery(getAllCompaniesQueryOptions())

  return {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  }
}
