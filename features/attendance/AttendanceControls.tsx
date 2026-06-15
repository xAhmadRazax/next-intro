import { Button } from "@/components/ui/button"
import { LogIn, LogOut, CheckCircle2 } from "lucide-react"
import { useClockIn } from "./hooks/useClockIn"
import { useClockOut } from "./hooks/useClockOut"
import { EmployeeAttendance } from "@/types/dashboard.types"
import { AttendanceType } from "@/db/schema"

export const AttendanceControls = ({
  attendance,
  onClockInHandler,
  onClockOutHandler,
}: {
  onClockInHandler?: (param: EmployeeAttendance) => void
  onClockOutHandler?: (param: EmployeeAttendance) => void
  attendance?: EmployeeAttendance
}) => {
  console.log("just dance++++++++++++++++++++++++++++")
  const { clockInHandler, isLoading: isClockingIn } = useClockIn()
  const { clockOutHandler, isLoading: isClockingOut } = useClockOut()

  const isClockedIn = !!attendance?.checkIn
  const isClockedOut = !!attendance?.checkOut
  const isWeekend = !!attendance?.isWeekend // ✅
  const isLoading = isClockingIn || isClockingOut

  return (
    <>
      {/* status bar */}
      <div className="mx-8 w-full rounded bg-muted p-2">
        {isWeekend ? (
          // 😴 weekend message
          <div className="flex w-full items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="size-2 rounded-full bg-neutral-400" />
            <p>It&apos;s the weekend, enjoy your rest! 🎉</p>
          </div>
        ) : isClockedIn && isClockedOut ? (
          // ✅ completed shift
          <div className="flex w-full items-center justify-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-green-500" />
            <p>
              Great work today! You worked from{" "}
              <span className="font-medium text-foreground">
                {attendance?.checkIn}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {attendance?.checkOut}
              </span>
              {attendance?.duration && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-medium text-foreground">
                    {attendance.duration}
                  </span>
                </>
              )}
            </p>
          </div>
        ) : isClockedIn ? (
          // 🟢 currently working
          <div className="flex w-full grow items-center space-x-2 text-sm text-muted-foreground">
            <div className="size-2 animate-pulse rounded-full bg-green-500" />
            <p>
              Clocked in at{" "}
              <span className="font-medium text-foreground">
                {attendance?.checkIn}
              </span>
            </p>
          </div>
        ) : (
          // ⚪ not started yet
          <div className="flex w-full items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="size-2 rounded-full bg-neutral-500" />
            <p>Not clocked in today.</p>
          </div>
        )}
      </div>

      {/* buttons — hidden on weekends ✅ */}
      {!isWeekend && (
        <div className="flex">
          {!isClockedIn && (
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => clockInHandler(onClockInHandler)}
            >
              <LogIn className="mr-2 size-4" />
              Clock In
            </Button>
          )}

          {isClockedIn && !isClockedOut && (
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => clockOutHandler(onClockOutHandler)}
            >
              <LogOut className="mr-2 size-4" />
              Clock Out
            </Button>
          )}

          {isClockedIn && isClockedOut && (
            <Button disabled variant="outline">
              <CheckCircle2 className="mr-2 size-4 text-green-500" />
              Shift complete
            </Button>
          )}
        </div>
      )}
    </>
  )
}
