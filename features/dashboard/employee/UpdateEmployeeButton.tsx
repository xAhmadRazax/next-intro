import { Button } from "@/components/ui/button"
import { UpdateEmployeeForm } from "./UpdateEmployeeForm"
import { Pencil } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { PublicUserType } from "@/db/schema"

interface UpdateEmployeeButtonProps {
  employee: PublicUserType
  updateEmployeeInCache?: (updatedEmployee: PublicUserType) => void
}

export const UpdateEmployeeButton = ({
  employee,
  updateEmployeeInCache,
}: UpdateEmployeeButtonProps) => {
  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button variant="ghost" title="Update" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </FormDialog.Trigger>
      <FormDialog.Content>
        <UpdateEmployeeForm
          employee={employee}
          employeeId={employee.id}
          updateEmployeeInCache={updateEmployeeInCache}
        />
      </FormDialog.Content>
    </FormDialog>
  )
}
