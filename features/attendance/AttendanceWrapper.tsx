"use client"
import dynamic from "next/dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AttendanceStats } from "./AttendanceStats"
import { AttendanceTable } from "./AttendanceTable"
import { AttendanceControls } from "./AttendanceControls"
import { useAttendanceQuery } from "./hooks/useAttendanceQuery"
const AttendanceClock = dynamic(() => import("./AttendanceClock"), {
  ssr: false,
})

export const AttendanceWrapper = () => {
  const { attendance, isLoading, onClockIn, onClockOut } = useAttendanceQuery()

  return (
    <div className="mt-4 mb-8 space-y-6 px-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 space-x-8">
          {!isLoading && (
            <>
              <AttendanceClock />

              {
                <AttendanceControls
                  onClockInHandler={onClockIn}
                  onClockOutHandler={onClockOut}
                  attendance={attendance?.todayAttendance || undefined}
                />
              }
              <AttendanceStats
                attendanceSummary={attendance?.totalAttendance.summary}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This Week Attendance</CardTitle>
        </CardHeader>
        <CardContent className="">
          <AttendanceTable
            attendance={attendance?.totalAttendance.attendance ?? []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
