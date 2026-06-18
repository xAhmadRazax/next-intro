import { EmployeeAttendanceStatsType } from "@/types/dashboard.types"
export const AttendanceStats = ({
  attendanceSummary,
  isLoading,
}: {
  attendanceSummary?: EmployeeAttendanceStatsType
  isLoading: boolean
}) => {
  return (
    <div className={`flex w-full gap-4 ${isLoading ? "animate-pulse" : ""}`}>
      <div className="grow rounded bg-muted p-4 text-center">
        <div className="text-2xl font-bold">
          {attendanceSummary?.totalDuration}
        </div>
        <div className="text-sm text-muted-foreground">This week</div>
      </div>

      <div className="grow rounded bg-muted p-4 text-center">
        <div className="text-2xl font-bold">
          {attendanceSummary?.weekdaysClocked}
        </div>
        <div className="text-sm text-muted-foreground">Weekdays Clocked</div>
      </div>
      <div className="grow rounded bg-muted p-4 text-center">
        <div className="text-2xl font-bold">
          {attendanceSummary?.averageDuration}
        </div>
        <div className="text-sm text-muted-foreground">Avg/Day</div>
      </div>
    </div>
  )
}
