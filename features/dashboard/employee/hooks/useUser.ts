import { getUserQueryOptions } from "@/queries/user.query"
import { useQuery } from "@tanstack/react-query"

export function useUser(userId: string) {
  const {
    data,
    error,
    isPending: isLoading,
  } = useQuery(getUserQueryOptions(userId))

  return { data, isLoading, error }
}
