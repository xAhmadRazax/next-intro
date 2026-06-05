"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { DeleteCompanyDialog } from "./DeleteCompanyDialog"

interface DeleteCompanyButtonProps {
  id: string
  name: string
  deleteItemCallback?: (id: string) => void
}

export const DeleteCompanyButton = ({
  id,
  name,
  deleteItemCallback,
}: DeleteCompanyButtonProps) => {
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
        <DeleteCompanyDialog
          id={id}
          name={name}
          deleteItemCallback={deleteItemCallback}
        />
      </FormDialog.Content>
    </FormDialog>
  )
}
