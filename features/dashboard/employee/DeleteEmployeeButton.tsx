"use client"
import { DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { Trash2 } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { DeleteEmployeeDialogContent } from "./DeleteEmployeeDialogContent"

interface DeleteEmployeeButtonProps {
  id: string
  name: string // Optional: show user name in confirmation
  deleteCachedEmployee?: (employeeId: string) => void
}

export const DeleteEmployeeButton = ({
  id,
  name,
  deleteCachedEmployee,
}: DeleteEmployeeButtonProps) => {
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

      <DialogContent className="px-6 text-foreground/80">
        <DeleteEmployeeDialogContent
          id={id}
          name={name}
          deleteCachedEmployee={deleteCachedEmployee}
        />
      </DialogContent>
    </FormDialog>
  )
}
