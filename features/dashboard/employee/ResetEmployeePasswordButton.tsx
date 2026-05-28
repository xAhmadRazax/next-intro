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
import { KeyRound } from "lucide-react"
import { useResetEmployeePassword } from "./hooks/useResetEmployeePassword"

interface ResetEmployeePasswordButtonProps {
  id: string
  name?: string // Optional: show user name in confirmation
}

export const ResetEmployeePasswordButton = ({
  id,
  name,
}: ResetEmployeePasswordButtonProps) => {
  const [open, setOpen] = useState(false)
  const { error, isLoading, resetEmployeePasswordHandler } =
    useResetEmployeePassword()

  const handleDelete = async () => {
    await resetEmployeePasswordHandler(id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" title="Reset password" />}
      >
        <KeyRound className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="px-6 text-foreground/80">
        <DialogHeader>
          <DialogTitle>Reset Employee Password</DialogTitle>
          <DialogDescription>
            Are you sure you want to Reset{" "}
            {name ? `"${name}"` : "this employee"} Password? This action cannot
            be undone
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="space-x-2 sm:gap-0">
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
            {isLoading ? "Resting Password..." : "Yes, Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
