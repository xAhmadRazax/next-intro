"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import FormDialog from "../components/FormDialog"

interface DeleteCompanyButtonProps {
  id: string
  name?: string // Optional: show company name in confirmation
}

export const DeleteCompanyButton = ({ id, name }: DeleteCompanyButtonProps) => {
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

      <FormDialog.Content></FormDialog.Content>
    </FormDialog>
  )
}
