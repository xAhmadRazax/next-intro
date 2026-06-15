import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { EmployeeAttendanceContent } from "./EmployeeAttendanceContent"
import { PublicUserType } from "@/db/schema"

export const ViewEmployeeAttendanceButton = ({
  employeeId,
  employee,
}: {
  employeeId: string
  employee: PublicUserType
}) => {
  return (
    <FormDialog>
      <FormDialog.Trigger className="max-w-auto">
        <Button variant="ghost" title="View Employee Attendance" size="icon">
          <Eye className="h-5 w-5" />
        </Button>
      </FormDialog.Trigger>
      <FormDialog.Content className="max-w-[calc(100vw-15px)] md:max-w-fit">
        <EmployeeAttendanceContent
          employee={employee}
          employeeId={employeeId}
        />
      </FormDialog.Content>
    </FormDialog>
  )
}
