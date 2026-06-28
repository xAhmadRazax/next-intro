import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { EmployeeAttendanceContent } from "./EmployeeAttendanceContent"
import { EmployeeType } from "@/types/dashboard.types"

export const ViewEmployeeAttendanceButton = ({
  employeeId,
  employee,
}: {
  employeeId: string
  employee: EmployeeType
}) => {
  return (
    <FormDialog>
      <FormDialog.Trigger className="max-w-auto">
        <Button variant="ghost" title="View Employee Attendance" size="icon">
          <CalendarDays className="h-5 w-5" />
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
