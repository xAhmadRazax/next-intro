import { BASEURL } from "@/constants/constants"
import { AttendanceWrapper } from "@/features/attendance/AttendanceWrapper"
import {
  EmployeeAttendance,
  EmployeeAttendanceStatsType,
} from "@/types/dashboard.types"
import { cookies } from "next/headers"

export const Attendance = async () => {
  const cookiesStore = await cookies()
  const [attendanceRes, summaryRes] = await Promise.all([
    fetch(
      `${BASEURL}/attendance?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookiesStore.toString(),
        },
      }
    ),
    fetch(`${BASEURL}/attendance/stats`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookiesStore.toString(),
      },
    }),
  ])

  if (!attendanceRes.ok) {
  }

  if (!summaryRes.ok) {
  }

  const { attendance } = await attendanceRes.json()
  const stats = await summaryRes.json()

  return (
    <>
      <section className="mx-auto flex w-full max-w-[95%] min-w-0 flex-1 flex-col xl:max-w-350">
        <header className="py-4 text-center">
          <h1 className="text-lg font-bold text-primary md:text-2xl">
            Attendance
          </h1>
        </header>
        <div className="mx-auto -mt-2 h-0.5 w-1/12 rounded-full bg-accent-foreground/30"></div>

        <AttendanceWrapper
          initialTotalAttendance={attendance as EmployeeAttendance[]}
          initialAttendanceSummary={stats as EmployeeAttendanceStatsType}
        />
      </section>
    </>
  )
}
