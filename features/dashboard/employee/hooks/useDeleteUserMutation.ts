import { deleteUserMutationOptions } from "@/queries/user.query"
import { useMutation } from "@tanstack/react-query"

export function useDeleteUserMutation(id: string) {
  const {
    mutate: deleteUserMutation,
    isPending: isLoading,
    error,
  } = useMutation(deleteUserMutationOptions(id))

  return { deleteUserMutation, isLoading, error }
}
