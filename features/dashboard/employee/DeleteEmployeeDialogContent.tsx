import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useFormDialog } from "../hooks/useFormDialog"
import { useDeleteEmployeeMutation } from "./hooks/useDeleteEmployeeMutation"
import { useRouter } from "next/navigation"

export function DeleteEmployeeDialogContent({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const { onSuccess } = useFormDialog()
  const { deleteEmployeeHandler, isLoading } = useDeleteEmployeeMutation()

  const deleteHandler = async () => {
    await deleteEmployeeHandler(id, onSuccess)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {name ? `"${name}"` : "this employee"}
          ? This action cannot be undone and will permanently remove the
          employee&apos;s data from the system.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          variant="outline"
          onClick={() => onSuccess}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={deleteHandler}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </Button>
      </DialogFooter>
    </>
  )
}
