import { EmployeeAttendance } from "@/types/dashboard.types"
import { DataTable } from "../dashboard/components/DataGridTable"
import { attendanceColumns } from "./attendance-column"

export const AttendanceTable = ({
  attendance,
  isLoading,
}: {
  attendance: EmployeeAttendance[] | null
  isLoading: boolean
}) => {
  const mockData = [
    {
      id: 1,
      day: "Monday",
      date: 9,
      clockIn: "09:02 AM",
      clockOut: "06:05 PM",
      workingHours: "9h 03m",
    },
    {
      id: 2,
      day: "Tuesday",
      date: 10,
      clockIn: "08:58 AM",
      clockOut: "06:00 PM",
      workingHours: "9h 02m",
    },
    {
      id: 3,
      day: "Wednesday",
      date: 11,
      clockIn: "09:10 AM",
      clockOut: "06:15 PM",
      workingHours: "9h 05m",
    },
    {
      id: 4,
      day: "Thursday",
      date: 12,
      clockIn: "09:00 AM",
      clockOut: "05:55 PM",
      workingHours: "8h 55m",
    },
    {
      id: 5,
      day: "Friday",
      date: 13,
      clockIn: "08:50 AM",
      clockOut: "06:10 PM",
      workingHours: "9h 20m",
    },
    {
      id: 6,
      day: "Saturday",
      date: 14,
      clockIn: "-",
      clockOut: "-",
      workingHours: "Off Day",
    },
    {
      id: 7,
      day: "Sunday",
      date: 15,
      clockIn: "-",
      clockOut: "-",
      workingHours: "Off Day",
    },
  ]

  console.log(attendance)

  if (isLoading || !attendance) {
    return <>Loading...</>
  }

  return (
    <div>
      <DataTable columns={attendanceColumns(false, 0)} data={attendance} />
    </div>
  )
}
