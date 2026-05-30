"use client"
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { useDeleteCompanyMutation } from "./hooks/useDeleteCompanyMutation"
import { useFormDialog } from "../hooks/useFormDialog"

interface DeleteCompanyButtonProps {
  id: string
  name?: string // Optional: show company name in confirmation
}

export const DeleteCompanyButton = ({ id, name }: DeleteCompanyButtonProps) => {
  const { deleteCompanyHandler, isLoading } = useDeleteCompanyMutation()
  const { onSuccess, setOpen } = useFormDialog()
  const handleDelete = () => {
    deleteCompanyHandler(id, onSuccess)
  }

  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button
          variant="ghost"
          size="icon"
          title="Delete"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </FormDialog.Trigger>

      <FormDialog.Content>
        <DialogHeader>
          <DialogTitle>Delete Company</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {name ? `"${name}"` : "this company"}? This action cannot be undone
            and will permanently remove the company&apos;s data from the system.
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
      </FormDialog.Content>
    </FormDialog>
  )
}
