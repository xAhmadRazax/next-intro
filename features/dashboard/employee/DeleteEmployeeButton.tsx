"use client"
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
import { useDeleteEmployeeMutation } from "./hooks/useDeleteEmployeeMutation"
import { useSearchParams } from "next/navigation"
import { employeeKeys } from "@/lib/queryKeys"
import { UserType } from "@/db/schema"
import { Trash2 } from "lucide-react"

interface DeleteEmployeeButtonProps {
  id: string
  name?: string // Optional: show user name in confirmation
}

export const DeleteEmployeeButton = ({
  id,
  name,
}: DeleteEmployeeButtonProps) => {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { deleteEmployeeMutation, isLoading } = useDeleteEmployeeMutation(id)

  const handleDelete = () => {
    deleteEmployeeMutation(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: employeeKeys.all,
        })
        queryClient.setQueryData(
          employeeKeys.list(page),
          (old: { data: UserType[] }) => ({
            ...old,
            data: old.data.filter((u) => u.id !== id),
          })
        )
        queryClient.invalidateQueries({ queryKey: employeeKeys.all })
        setOpen(false) // Close dialog on success
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title="Delete"
            className="text-destructive hover:text-destructive"
          />
        }
      >
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="px-6 text-foreground/80">
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {name ? `"${name}"` : "this employee"}? This action cannot be undone
            and will permanently remove the employee&apos;s data from the
            system.
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
