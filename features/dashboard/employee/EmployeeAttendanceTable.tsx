import { EmployeeAttendance } from "@/types/dashboard.types"
import { DataTable } from "../components/DataGridTable"
import { attendanceColumns } from "./attendance-column"

export const AttendanceTable = ({
  className = "",
  attendance,
  isLoading,
}: {
  attendance: EmployeeAttendance[] | null
  isLoading: boolean
  className?: string
}) => {
  if (isLoading || !attendance) {
    return <>Loading...</>
  }

  return (
    <DataTable
      wrapperClassName={`md:max-w-180 overflow-y-auto ${className}`}
      columns={attendanceColumns(false, 0)}
      data={attendance}
    />
  )
}
