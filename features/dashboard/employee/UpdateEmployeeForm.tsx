import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUpdateUserMutation } from "./hooks/useUpdateUserMutation"
import { useQueryClient } from "@tanstack/react-query"
import type { UserType } from "@/types/dashboard.types"
import { useSearchParams } from "react-router"

interface UpdateEmployeeFormProps {
  user: UserType
  userId: string
  onSuccess: () => void
}

export const UpdateEmployeeForm = ({
  onSuccess,
  userId,
  user,
}: UpdateEmployeeFormProps) => {
  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()

  const { updateUserMutation, isLoading: isUpdatingUser } =
    useUpdateUserMutation(userId)

  const name = user?.name ?? ""
  const email = user?.email ?? ""
  const age = user?.age ?? ""

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const age = formData.get("age") as string

    updateUserMutation(
      {
        name,
        email,
        age: +age,
      },
      {
        onSuccess: (updated: UserType) => {
          onSuccess?.()

          queryClient.setQueryData(["users", userId], updated)

          const page = searchParams.get("page") || "1"

          queryClient.setQueryData(
            ["users", +page],
            (old: { data: UserType[] }) => ({
              ...old,
              data: old.data.map((u) => (u.id === updated.id ? updated : u)),
            })
          )
        },
      }
    )
  }

  return (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="mb-2 text-xl text-primary">
          Update Employee
        </DialogTitle>
      </DialogHeader>

      <Form onSubmit={onSubmitHandler}>
        <Form.Field>
          <Form.Label>Email</Form.Label>

          <Form.Input
            name="email"
            type="email"
            placeholder="john@example.com"
            defaultValue={email}
            disabled={isUpdatingUser}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label>Name</Form.Label>

          <Form.Input
            name="name"
            placeholder="John Doe"
            required
            defaultValue={name}
            disabled={isUpdatingUser}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label>Age</Form.Label>

          <Form.Input
            name="age"
            type="number"
            placeholder="18"
            required
            defaultValue={age}
            min={0}
            disabled={isUpdatingUser}
          />
        </Form.Field>

        <Form.Actions>
          <Form.Submit disabled={isUpdatingUser}>
            {isUpdatingUser ? "Updating Employee..." : "Update Employee"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
