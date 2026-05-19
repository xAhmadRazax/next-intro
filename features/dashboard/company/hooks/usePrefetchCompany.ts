// hooks/usePrefetchUsers.ts
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getCompanies } from "@/lib/api"
import { companyKeys } from "@/lib/queryKeys"

export const usePrefetchCompany = (currentPage: number, totalPages: number) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Prefetch next page
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: companyKeys.page(currentPage + 1),
        queryFn: () => getCompanies({ page: currentPage + 1 }),
      })
    }

    // Prefetch previous page
    if (currentPage > 1) {
      queryClient.prefetchQuery({
        queryKey: companyKeys.page(currentPage - 1),
        queryFn: () => getCompanies({ page: currentPage - 1 }),
      })
    }
  }, [currentPage, totalPages, queryClient])
}
