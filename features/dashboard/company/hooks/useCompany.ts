import { getCompanyQueryOptions } from "@/queries/company.query"
import { useQuery } from "@tanstack/react-query"

export function useCompany(companyId: string) {
  const {
    data,
    error,
    isPending: isLoading,
  } = useQuery(getCompanyQueryOptions(companyId))

  return { data, isLoading, error }
}
