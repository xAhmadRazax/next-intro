"use client"
import { Button } from "@/components/ui/button"
import FormDialog from "../components/FormDialog"
import { Plus } from "lucide-react"
import { AddCompanyForm } from "./AddCompanyForm"

export const AddCompanyButton = () => {
  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button
          variant="default" // ✅ Use theme color
          size="sm" // ✅ Match other buttons
          className="mb-4 flex gap-1.5 xl:me-4"
        >
          <Plus className="size-3.5" />
          Add Company
        </Button>
      </FormDialog.Trigger>

      <FormDialog.Content>
        <AddCompanyForm />
      </FormDialog.Content>
    </FormDialog>
  )
}
