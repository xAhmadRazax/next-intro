import { updateCompanyMutationOptions } from "@/queries/company.query"
import { useMutation } from "@tanstack/react-query"

export function useUpdateCompanyMutation(id: string) {
  const {
    mutate: updateCompanyMutation,
    isPending: isLoading,
    error,
  } = useMutation(updateCompanyMutationOptions(id))

  return { updateCompanyMutation, isLoading, error }
}
