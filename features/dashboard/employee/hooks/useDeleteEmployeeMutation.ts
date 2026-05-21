import { deleteEmployeeMutationOptions } from "@/queries/employee.query"
import { useMutation } from "@tanstack/react-query"

export function useDeleteEmployeeMutation(id: string) {
  const {
    mutate: deleteEmployeeMutation,
    isPending: isLoading,
    error,
  } = useMutation(deleteEmployeeMutationOptions(id))

  return { deleteEmployeeMutation, isLoading, error }
}
