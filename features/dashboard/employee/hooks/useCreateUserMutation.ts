import { createUserMutationOptions } from "@/queries/user.query"
import { useMutation } from "@tanstack/react-query"

export function useCreateUserMutation() {
  const {
    mutate: createUserMutation,
    isPending: isLoading,
    error,
  } = useMutation(createUserMutationOptions)

  return { createUserMutation, isLoading, error }
}
