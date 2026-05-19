import { getUsersQueryOptions } from "@/queries/user.query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"

export function useUsers() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get("page")) || 1

  const {
    data,
    isPending: isLoading,
    error,
    refetch,
    isRefetching,
  } = useSuspenseQuery(getUsersQueryOptions({ page, itemsPerPage: 10 }))

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
