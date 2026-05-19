import { updateUserMutationOptions } from "@/queries/user.query"
import { useMutation } from "@tanstack/react-query"

export function useUpdateUserMutation(id: string) {
  const {
    mutate: updateUserMutation,
    isPending: isLoading,
    error,
  } = useMutation(updateUserMutationOptions(id))

  return { updateUserMutation, isLoading, error }
}
