"use client"
import dynamic from "next/dynamic"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EmployeeAttendanceStats } from "./EmployeeAttendanceStats"
import { AttendanceTable } from "./EmployeeAttendanceTable"
import { EmployeeAttendanceControls } from "./EmployeeAttendanceControls"
import { useAttendanceQuery } from "./hooks/useAttendanceQuery"
import {
  EmployeeAttendance,
  EmployeeAttendanceStatsType,
} from "@/types/dashboard.types"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { useAuthContext } from "@/context/auth.context"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAttendanceStatsQuery } from "./hooks/useAttendanceStatsQuery"
const EmployeeAttendanceClock = dynamic(
  () => import("./EmployeeAttendanceClock"),
  {
    ssr: false,
  }
)

export const EmployeeAttendanceWrapper = ({
  initialTotalAttendance,
  initialAttendanceSummary,
}: {
  initialTotalAttendance: EmployeeAttendance[]
  initialAttendanceSummary: EmployeeAttendanceStatsType
}) => {
  const [filters, setFilters] = useState<{
    month: number
    year: number
    status: string
  }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    status: "All",
  })

  const { attendance, isLoading, onClockIn, onClockOut } = useAttendanceQuery(
    {
      initialTotalAttendance,
    },
    filters
  )

  const {
    attendanceStats,
    fetchAttendanceStats,
    isLoading: isLoadingAttendanceStats,
  } = useAttendanceStatsQuery({
    initialAttendanceStats: initialAttendanceSummary,
  })

  const { user: employee } = useAuthContext()

  return (
    <div className="mt-4 mb-8 space-y-6 px-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 space-x-8">
          {!isLoading && (
            <>
              <EmployeeAttendanceClock />

              {
                <EmployeeAttendanceControls
                  onClockInHandler={onClockIn}
                  onClockOutHandler={(param: EmployeeAttendance) => {
                    onClockOut(param)
                    fetchAttendanceStats()
                  }}
                  attendance={attendance?.todayAttendance || undefined}
                />
              }
              <EmployeeAttendanceStats
                isLoading={isLoadingAttendanceStats || isLoading}
                attendanceSummary={attendanceStats}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Calendar
              startMonth={employee?.createdAt ?? undefined}
              endMonth={new Date()}
              month={
                new Date(filters.year, filters.month, new Date().getDate())
              }
              onMonthChange={(date: Date) => {
                setFilters((prev) => ({
                  ...prev,
                  month: +date.getMonth(),
                  year: date.getFullYear(),
                }))
              }}
              mode="single"
              captionLayout="dropdown"
              className="w-full rounded-lg border bg-card"
              formatters={{
                formatMonthDropdown: (month: Date) =>
                  month.toLocaleDateString("en-US", { month: "long" }),
              }}
              classNames={{
                month_caption:
                  "flex items-center justify-between w-full px-2 py-2",
                dropdowns: "flex items-center gap-2",
              }}
              styles={{
                month_grid: { display: "none" },
                weeks: { display: "none" },
                weekdays: { display: "none" },
                month: { width: "100%" }, // ✅ full width
                month_caption: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // ✅ arrows pushed to edges
                  width: "100%",
                  padding: "8px",
                  height: "24px",
                },
                dropdowns: {
                  display: "flex",
                  gap: "8px",
                  position: "absolute", // ✅ center in the middle
                  left: "50%",
                  transform: "translateX(-50%)",
                },
                nav: {
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between", // ✅ arrows on each side
                  height: "100%",
                },
              }}
            />

            <Select
              onValueChange={(value: string | null) =>
                setFilters((prev) => ({ ...prev, status: value ?? "ALL" }))
              }
            >
              <SelectTrigger className="h-12.5! w-45 rounded-lg! bg-card!">
                <SelectValue placeholder={filters?.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="">
          <AttendanceTable
            wrapperClass="max-w-[calc(100vw-80px)]"
            attendance={attendance?.totalAttendance ?? []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
