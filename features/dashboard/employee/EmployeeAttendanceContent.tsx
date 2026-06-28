"use client"

import { Card } from "@/components/ui/card"
import { useAttendanceQuery } from "./attendance/useAttendanceQuery"
import { AttendanceTable } from "./EmployeeAttendanceTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { PublicUserType } from "@/db/schema"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmployeeType } from "@/types/dashboard.types"

export const EmployeeAttendanceContent = ({
  employee,
  employeeId,
}: {
  employeeId: string
  employee: EmployeeType
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
  const { attendance, isLoading } = useAttendanceQuery(employeeId, filters)

  const summary = attendance?.summary

  return (
    <div className="my-4 mt-8 space-y-6 overflow-hidden p-2">
      <Card className="gap-2 p-4">
        {/* employee info */}
        <div className="flex items-center gap-4 border-b pb-2">
          <Avatar className="h-14 w-14">
            <AvatarImage src={employee?.avatar ?? undefined} />
            <AvatarFallback className="text-lg">
              {employee?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{employee?.name}</p>
            <p className="text-sm text-muted-foreground">{employee?.email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Joined{" "}
              {employee?.createdAt
                ? new Date(employee.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">This month</p>
            <p className="font-medium">{summary?.month.totalDuration ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg per day</p>
            <p className="font-medium">
              {summary?.month.averageDuration ?? "—"}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        {/* <Input type="month" /> */}
        <Calendar
          startMonth={employee.createdAt ?? undefined}
          endMonth={new Date()}
          month={new Date(filters.year, filters.month, new Date().getDate())}
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
            month_caption: "flex items-center justify-between w-full px-2 py-2",
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
      <AttendanceTable
        className="max-h-50"
        attendance={attendance?.attendance ?? []}
        isLoading={isLoading}
      />
    </div>
  )
}
