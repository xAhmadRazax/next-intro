"use client"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useFormDialog } from "../hooks/useFormDialog"
import { useDeleteCompanyMutation } from "./hooks/useDeleteCompanyMutation"
import { Button } from "@/components/ui/button"

export const DeleteCompanyDialog = ({
  name,
  id,
  deleteItemCallback,
}: {
  name: string
  id: string
  deleteItemCallback?: (id: string) => void
}) => {
  const { deleteCompanyHandler, isLoading } = useDeleteCompanyMutation()
  const { onSuccess } = useFormDialog()
  const handleDelete = async () => {
    await deleteCompanyHandler(id, () => {
      onSuccess?.()
      deleteItemCallback?.(id)
    })
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {name ? `"${name}"` : "this company"}?
          This action cannot be undone and will permanently remove the
          company&apos;s data from the system.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onSuccess} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          // disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </Button>
      </DialogFooter>
    </>
  )
}
