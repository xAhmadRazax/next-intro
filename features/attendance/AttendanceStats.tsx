import { EmployeeAttendanceSummaryType } from "@/types/dashboard.types"
export const AttendanceStats = ({
  attendanceSummary,
}: {
  attendanceSummary?: EmployeeAttendanceSummaryType
}) => {
  return (
    <div className="flex w-full gap-4">
      <div className="grow rounded bg-muted p-4 text-center">
        <div className="text-2xl font-bold">
          {attendanceSummary?.week.totalDuration}
        </div>
        <div className="text-sm text-muted-foreground">This week</div>
      </div>

      <div className="grow rounded bg-muted p-4 text-center">
        <div className="text-2xl font-bold">
          {attendanceSummary?.month.weekdaysClocked}
        </div>
        <div className="text-sm text-muted-foreground">Weekdays Clocked</div>
      </div>

      <div className="grow rounded bg-muted p-4 text-center">
        <div className="text-2xl font-bold">
          {attendanceSummary?.week.averageDuration}
        </div>
        <div className="text-sm text-muted-foreground">Avg/Day</div>
      </div>
    </div>
  )
}
