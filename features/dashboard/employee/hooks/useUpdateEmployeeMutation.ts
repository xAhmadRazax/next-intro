import { updateEmployeeMutationOptions } from "@/queries/employee.query"
import { useMutation } from "@tanstack/react-query"

export function useUpdateEmployeeMutation(id: string) {
  const {
    mutate: updateEmployeeMutation,
    isPending: isLoading,
    error,
  } = useMutation(updateEmployeeMutationOptions(id))

  return { updateEmployeeMutation, isLoading, error }
}
