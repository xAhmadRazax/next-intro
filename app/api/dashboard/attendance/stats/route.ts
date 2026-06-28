import { db } from "@/db"
import { attendance } from "@/db/schema"
import { toLocalDateString } from "@/lib/date-util"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"
import { and, between, eq } from "drizzle-orm"

export const GET = RouteGuard.requireAuth(async (req) => {
  try {
    const authReq = req as AuthReqType
    const todayDate = new Date()

    const startOfMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      1
    )
    startOfMonth.setHours(0, 0, 0, 0)
    const endOfMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth() + 1,
      0
    )
    endOfMonth.setHours(23, 59, 59, 999)

    const user = authReq.user

    const monthRecords = await db.query.attendance.findMany({
      where: and(
        eq(attendance.employeeId, user.id),
        between(
          attendance.checkIn,
          new Date(startOfMonth.toDateString()),
          new Date(endOfMonth.toDateString())
        )
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

    let totalMonthDaysWorkedMinutes = 0
    let completedShifts = 0

    monthRecords.forEach((el) => {
      if (el.checkOut && el.checkIn) {
        const min = Math.round(
          (el.checkOut.getTime() - el.checkIn.getTime()) / 60000
        )

        if (min) {
          completedShifts++
          totalMonthDaysWorkedMinutes += min
        }
      }
    })

    const monthAvgMinutes =
      completedShifts > 0
        ? Math.round(totalMonthDaysWorkedMinutes / completedShifts)
        : 0

    return Response.json(
      {
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
        weekdaysClocked: completedShifts, // ✅ how many weekdays he clocked this month
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
})
