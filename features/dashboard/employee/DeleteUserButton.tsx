import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import type { UserType } from "@/types/dashboard.types"
import { useSearchParams } from "react-router"
import { useDeleteUserMutation } from "./hooks/useDeleteUserMutation"

interface DeleteUserButtonProps {
  id: string
  name?: string // Optional: show user name in confirmation
}

export const DeleteUserButton = ({ id, name }: DeleteUserButtonProps) => {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { deleteUserMutation, isLoading } = useDeleteUserMutation(id)

  const handleDelete = () => {
    deleteUserMutation(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
          refetchType: "all",
        })
        queryClient.setQueryData(
          ["users", page],
          (old: { data: UserType[] }) => ({
            ...old,
            data: old.data.filter((u) => u.id !== id),
          })
        )
        setOpen(false) // Close dialog on success
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        Delete
      </DialogTrigger>

      <DialogContent className="px-6 text-foreground/80">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {name ? `"${name}"` : "this user"}?
            This action cannot be undone and will permanently remove the user's
            data from the system.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
