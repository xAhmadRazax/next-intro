import { createCompanyMutationOptions } from "@/queries/company.query"
import { useMutation } from "@tanstack/react-query"

export function useCreateCompanyMutation() {
  const {
    mutate: createCompanyMutation,
    isPending: isLoading,
    error,
  } = useMutation(createCompanyMutationOptions)

  return { createCompanyMutation, isLoading, error }
}
