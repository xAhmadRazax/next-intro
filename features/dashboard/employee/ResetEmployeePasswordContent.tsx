import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useFormDialog } from "../hooks/useFormDialog"
import { useResetEmployeePasswordMutation } from "./hooks/useResetEmployeePasswordMutation"

export function ResetEmployeePasswordContent({
  name,
  id,
}: {
  name: string
  id: string
}) {
  const { onSuccess } = useFormDialog()

  const { isLoading, resetEmployeePasswordMutationHandler } =
    useResetEmployeePasswordMutation()

  async function resetEmployeePasswordHandler() {
    await resetEmployeePasswordMutationHandler(id, onSuccess)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reset Employee Password</DialogTitle>
        <DialogDescription>
          Are you sure you want to Reset {name ? `"${name}"` : "this employee"}{" "}
          Password? This action cannot be undone
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="space-x-2 sm:gap-0">
        <Button variant="outline" onClick={onSuccess} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={resetEmployeePasswordHandler}
          disabled={isLoading}
        >
          {isLoading ? "Resting Password..." : "Yes, Reset Password"}
        </Button>
      </DialogFooter>
    </>
  )
}
