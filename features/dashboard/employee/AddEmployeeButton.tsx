"use client"
import { Button } from "@/components/ui/button"
import { AddEmployeeForm } from "./AddEmployeeForm"
import { Plus } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { PublicUserType } from "@/db/schema"

export const AddEmployeeButton = ({
  addEmployeeToCache,
}: {
  addEmployeeToCache: (employee: PublicUserType) => void
}) => {
  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button
          variant="default" // ✅ Use theme color
          size="sm" // ✅ Match other buttons
          className="mb-4 flex gap-1.5 xl:me-4"
        >
          <Plus className="size-3.5" />
          Add Employee
        </Button>
      </FormDialog.Trigger>

      <FormDialog.Content>
        <AddEmployeeForm addEmployeeToCache={addEmployeeToCache} />
      </FormDialog.Content>
    </FormDialog>
  )
}
