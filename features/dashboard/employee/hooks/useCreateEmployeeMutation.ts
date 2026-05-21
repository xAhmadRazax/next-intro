import { createEmployeeMutationOptions } from "@/queries/employee.query"
import { useMutation } from "@tanstack/react-query"

export function useCreateEmployeeMutation() {
  const {
    mutate: createEmployeeMutation,
    isPending: isLoading,
    error,
  } = useMutation(createEmployeeMutationOptions)

  return { createEmployeeMutation, isLoading, error }
}
