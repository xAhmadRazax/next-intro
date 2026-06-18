import { db } from "@/db"
import { attendance } from "@/db/schema"
import { toLocalDateString } from "@/lib/date-util"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { and, between, eq } from "drizzle-orm"

export const GET = RouteGuard.requireAuthWithRole(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params

      const { searchParams } = new URL(req.url)
      const todayDate = new Date()
      const monthOffset = +(searchParams.get("month") || todayDate.getMonth())

      const yearOffset = +(searchParams.get("year") || todayDate.getFullYear())

      console.log(new Date().getMonth())

      const startOfMonth = new Date(yearOffset, monthOffset - 1, 1)
      startOfMonth.setHours(0, 0, 0, 0)
      const endOfMonth = new Date(yearOffset, monthOffset, 0)
      endOfMonth.setHours(23, 59, 59, 999)

      const monthRecords = await db.query.attendance.findMany({
        where: and(
          eq(attendance.userId, id),
          between(attendance.checkIn, startOfMonth, endOfMonth)
        ),
        orderBy: attendance.checkIn,
      })

      const attendanceMap = new Map()
      monthRecords.forEach((record) => {
        if (record.checkIn) {
          attendanceMap.set(toLocalDateString(new Date(record.checkIn)), record)
        }
      })

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayKey = toLocalDateString(today)

      let totalMonthDaysWorkedMinutes = 0
      let completedShifts = 0

      const days = Array.from({ length: endOfMonth.getDate() }).map(
        (_, index) => {
          const currentDate = new Date(
            startOfMonth.getFullYear(),
            startOfMonth.getMonth(),
            startOfMonth.getDate() + index
          )
          const dayName = currentDate.toLocaleDateString("en-US", {
            weekday: "long",
          })
          const dateKey = toLocalDateString(currentDate)
          const isWeekend = dayName === "Saturday" || dayName === "Sunday"
          const isFuture = currentDate > today
          const isToday = dateKey === todayKey
          const record = attendanceMap.get(dateKey)

          const base = {
            date: dateKey,
            day: dayName,
            isWeekend,
            isFuture,
            isToday,
          }

          if (isWeekend) {
            return {
              ...base,
              status: "weekend",
              checkIn: null,
              checkOut: null,
              duration: null,
            }
          }

          if (isFuture) {
            return {
              ...base,
              status: "upcoming",
              checkIn: null,
              checkOut: null,
              duration: null,
            }
          }

          if (record) {
            const checkInDate = new Date(record.checkIn)
            const checkOutDate = record.checkOut
              ? new Date(record.checkOut)
              : null
            const mins = checkOutDate
              ? Math.round(
                  (checkOutDate.getTime() - checkInDate.getTime()) / 60000
                )
              : null

            if (mins) {
              totalMonthDaysWorkedMinutes += mins
              completedShifts++
            }

            return {
              ...base,
              status: checkOutDate ? "completed" : "active",
              checkIn: checkInDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              checkOut: checkOutDate
                ? checkOutDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : null,
              duration: mins
                ? mins < 60
                  ? `${mins ?? 0}m`
                  : `${Math.floor(mins / 60)}h ${mins % 60}m`
                : null,
            }
          }

          return {
            ...base,
            status: isToday ? "pending" : "absent",
            checkIn: null,
            checkOut: null,
            duration: null,
          }
        }
      ) // ✅ week stats
      const monthDays = days.filter((d) => !d.isWeekend)
      const totalPastMonthDays = monthDays.filter((d) => !d.isFuture).length
      const attendedDays = monthDays.filter(
        (d) => d.status === "completed" || d.status === "active"
      ).length
      const monthAvgMinutes =
        completedShifts > 0
          ? Math.round(totalMonthDaysWorkedMinutes / completedShifts)
          : 0

      return Response.json(
        {
          attendance: days,
          summary: {
            month: {
              monthName: startOfMonth.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              }),
              totalDuration:
                totalMonthDaysWorkedMinutes < 60
                  ? `${totalMonthDaysWorkedMinutes}m`
                  : `${Math.floor(totalMonthDaysWorkedMinutes / 60)}h ${totalMonthDaysWorkedMinutes % 60}m`,
              averageDuration:
                monthAvgMinutes < 60
                  ? `${monthAvgMinutes}m`
                  : `${Math.floor(monthAvgMinutes / 60)}h ${monthAvgMinutes % 60}m`,
              weekdaysClocked: attendedDays, // ✅ how many weekdays he clocked this month
              totalMonthWeekdays: totalPastMonthDays, // ✅ total weekdays in month up to today
            },
          },
        },
        { status: 200 }
      )
    } catch (error) {
      console.log(error)
      const postgresError = handlePostgresError(error)
      if (postgresError) return postgresError
      return Response.json({ error: "Internal server error" }, { status: 500 })
    }
  },
  ["admin"]
)
