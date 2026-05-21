// hooks/usePrefetchUsers.ts
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getEmployees } from "@/lib/api"
import { employeeKeys } from "@/lib/queryKeys"

export const usePrefetchEmployees = (
  currentPage: number,
  totalPages: number
) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Prefetch next page
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: employeeKeys.list(currentPage + 1),
        queryFn: () => getEmployees({ page: currentPage + 1 }),
      })
    }

    // Prefetch previous page
    if (currentPage > 1) {
      queryClient.prefetchQuery({
        queryKey: employeeKeys.list(currentPage - 1),
        queryFn: () => getEmployees({ page: currentPage - 1 }),
      })
    }
  }, [currentPage, totalPages, queryClient])
}
