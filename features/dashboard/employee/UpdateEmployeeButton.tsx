import { Button } from "@/components/ui/button"
import { UpdateEmployeeForm } from "./UpdateEmployeeForm"
import { Pencil } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { EmployeeType } from "@/types/dashboard.types"

interface UpdateEmployeeButtonProps {
  employee: EmployeeType
  updateEmployeeInCache?: (updatedEmployee: EmployeeType) => void
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
      <FormDialog.Content className="sm:max-w-md">
        <UpdateEmployeeForm
          employee={employee}
          employeeId={employee.id}
          updateEmployeeInCache={updateEmployeeInCache}
        />
      </FormDialog.Content>
    </FormDialog>
  )
}
