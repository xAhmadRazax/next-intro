import { deleteCompanyMutationOptions } from "@/queries/company.query"
import { useMutation } from "@tanstack/react-query"

export function useDeleteCompanyMutation(id: string) {
  const {
    mutate: deleteCompanyMutation,
    isPending: isLoading,
    error,
  } = useMutation(deleteCompanyMutationOptions(id))

  return { deleteCompanyMutation, isLoading, error }
}
