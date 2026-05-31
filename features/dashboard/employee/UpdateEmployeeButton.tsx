import { Button } from "@/components/ui/button"
import { UpdateEmployeeForm } from "./UpdateEmployeeForm"
import { Pencil } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { UserType } from "@/db/schema"

interface UpdateEmployeeButtonProps {
  employee: UserType
}

export const UpdateEmployeeButton = ({
  employee,
}: UpdateEmployeeButtonProps) => {
  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button variant="ghost" title="Update" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </FormDialog.Trigger>
      <FormDialog.Content>
        <UpdateEmployeeForm employee={employee} employeeId={employee.id} />
      </FormDialog.Content>
    </FormDialog>
  )
}
