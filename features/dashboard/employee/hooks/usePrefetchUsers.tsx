// hooks/usePrefetchUsers.ts
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getUsers } from "@/lib/api"

export const usePrefetchUsers = (currentPage: number, totalPages: number) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Prefetch next page
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["users", currentPage + 1],
        queryFn: () => getUsers({ page: currentPage + 1, itemsPerPage: 10 }),
      })
    }

    // Prefetch previous page
    if (currentPage > 1) {
      queryClient.prefetchQuery({
        queryKey: ["users", currentPage - 1],
        queryFn: () => getUsers({ page: currentPage - 1, itemsPerPage: 10 }),
      })
    }
  }, [currentPage, totalPages, queryClient])
}
