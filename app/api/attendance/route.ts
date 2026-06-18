import { db } from "@/db"
import { attendance } from "@/db/schema"
import { toLocalDateString } from "@/lib/date-util"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"
import { eq, and, between } from "drizzle-orm"

// export const GET = RouteGuard.requireAuth(async (req: AuthReqType) => {
//   const { endOfWeek, startOfWeek } = getWeekRangeForDate(new Date())

//   const user = req.user

//   const attendanceRec = await db.query.attendance.findMany({
//     where: and(
//       eq(attendance.userId, user.id),
//       between(attendance.checkIn, new Date(startOfWeek), new Date(endOfWeek))
//     ),
//     orderBy: attendance.checkIn,
//   })

//   return Response.json({ attendance: attendanceRec }, { status: 200 })
// })

// export const GET = RouteGuard.requireAuth(async (req: AuthReqType) => {
//   try {
//     const { searchParams } = new URL(req.url)

//     const weekOffset = parseInt(searchParams.get("weekOffset") || "0")

//     const targetDate = new Date()
//     targetDate.setDate(targetDate.getDate() + weekOffset * 7)

//     const { startOfWeek, endOfWeek } = getWeekRangeForDate(targetDate)
//     const user = req.user

//     // ✅ get start and end of current month for monthly stats
//     const monthStart = new Date(
//       targetDate.getFullYear(),
//       targetDate.getMonth(),
//       1
//     )
//     monthStart.setHours(0, 0, 0, 0)
//     const monthEnd = new Date(
//       targetDate.getFullYear(),
//       targetDate.getMonth() + 1,
//       0
//     )
//     monthEnd.setHours(23, 59, 59, 999)

//     const [weekRecords, monthRecords] = await Promise.all([
//       db.query.attendance.findMany({
//         where: and(
//           eq(attendance.userId, user.id),
//           between(
//             attendance.checkIn,
//             new Date(startOfWeek),
//             new Date(endOfWeek)
//           )
//         ),
//         orderBy: attendance.checkIn,
//       }),
//       db.query.attendance.findMany({
//         where: and(
//           eq(attendance.userId, user.id),
//           between(attendance.checkIn, monthStart, monthEnd)
//         ),
//         orderBy: attendance.checkIn,
//       }),
//     ])

//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     const todayKey = toLocalDateString(today)

//     // ✅ week attendance map
//     const attendanceMap = new Map()
//     weekRecords.forEach((record) => {
//       if (record.checkIn) {
//         attendanceMap.set(toLocalDateString(new Date(record.checkIn)), record)
//       }
//     })

//     const weekStart = new Date(startOfWeek)
//     const allWeekDays = [
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//       "Sunday",
//     ]

//     let weekTotalMinutes = 0
//     let weekWorkedDays = 0

//     const days = allWeekDays.map((dayName, index) => {
//       const currentDate = new Date(
//         weekStart.getFullYear(),
//         weekStart.getMonth(),
//         weekStart.getDate() + index
//       )
//       const dateKey = toLocalDateString(currentDate)
//       const isWeekend = dayName === "Saturday" || dayName === "Sunday"
//       const isFuture = currentDate > today
//       const isToday = dateKey === todayKey
//       const record = attendanceMap.get(dateKey)

//       const base = { date: dateKey, day: dayName, isWeekend, isFuture, isToday }

//       if (isWeekend) {
//         return {
//           ...base,
//           status: "weekend",
//           checkIn: null,
//           checkOut: null,
//           duration: null,
//         }
//       }

//       if (isFuture) {
//         return {
//           ...base,
//           status: "upcoming",
//           checkIn: null,
//           checkOut: null,
//           duration: null,
//         }
//       }

//       if (record) {
//         const checkInDate = new Date(record.checkIn)
//         const checkOutDate = record.checkOut ? new Date(record.checkOut) : null
//         const mins = checkOutDate
//           ? Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 60000)
//           : null

//         if (mins) {
//           weekTotalMinutes += mins
//           weekWorkedDays++
//         }

//         return {
//           ...base,
//           status: checkOutDate ? "completed" : "active",
//           checkIn: checkInDate.toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           }),
//           checkOut: checkOutDate
//             ? checkOutDate.toLocaleTimeString("en-US", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//               })
//             : null,
//           duration: mins
//             ? mins < 60
//               ? `${mins}m`
//               : `${Math.floor(mins / 60)}h ${mins % 60}m`
//             : null,
//         }
//       }

//       return {
//         ...base,
//         status: isToday ? "pending" : "absent",
//         checkIn: null,
//         checkOut: null,
//         duration: null,
//       }
//     })

//     // ✅ week stats
//     const weekdays = days.filter((d) => !d.isWeekend)
//     const totalWeekdays = weekdays.filter((d) => !d.isFuture).length
//     const weekdaysClocked = weekdays.filter(
//       (d) => d.status === "completed" || d.status === "active"
//     ).length
//     const avgMinutes =
//       weekWorkedDays > 0 ? Math.round(weekTotalMinutes / weekWorkedDays) : 0

//     // ✅ monthly stats
//     let monthTotalMinutes = 0
//     let monthClockedDays = 0

//     monthRecords.forEach((record) => {
//       if (!record.checkIn) return

//       const day = new Date(record.checkIn).getDay()
//       // here 6 is sat and 0 is sunday
//       const isWeekend = day === 0 || day === 6
//       if (isWeekend) return // skip weekends

//       const checkInDate = new Date(record.checkIn)
//       const checkOutDate = record.checkOut ? new Date(record.checkOut) : null
//       const mins = checkOutDate
//         ? Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 60000)
//         : null

//       if (mins) {
//         monthTotalMinutes += mins
//       }

//       monthClockedDays++ // count clocked days regardless of checkout
//     })

//     // ✅ total weekdays in month up to today
//     const totalMonthWeekdays = Array.from(
//       {
//         length:
//           today.getMonth() === targetDate.getMonth()
//             ? today.getDate()
//             : monthEnd.getDate(),
//       },
//       (_, i) => new Date(targetDate.getFullYear(), targetDate.getMonth(), i + 1)
//     ).filter((d) => d.getDay() !== 0 && d.getDay() !== 6).length

//     const monthAvgMinutes =
//       monthClockedDays > 0
//         ? Math.round(monthTotalMinutes / monthClockedDays)
//         : 0

//     return Response.json(
//       {
//         attendance: days,
//         summary: {
//           week: {
//             weekRange: {
//               start: toLocalDateString(weekStart),
//               end: toLocalDateString(
//                 new Date(
//                   weekStart.getFullYear(),
//                   weekStart.getMonth(),
//                   weekStart.getDate() + 6
//                 )
//               ),
//             },
//             totalDuration:
//               weekTotalMinutes < 60
//                 ? `${weekTotalMinutes}m`
//                 : `${Math.floor(weekTotalMinutes / 60)}h ${weekTotalMinutes % 60}m`,
//             averageDuration:
//               avgMinutes < 60
//                 ? `${avgMinutes}m`
//                 : `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`,
//             workedDays: weekWorkedDays,
//             weekdaysClocked,
//             totalWeekdays,
//             weekOffset,
//           },
//           month: {
//             monthName: targetDate.toLocaleString("en-US", {
//               month: "long",
//               year: "numeric",
//             }),
//             totalDuration:
//               monthTotalMinutes < 60
//                 ? `${monthTotalMinutes}m`
//                 : `${Math.floor(monthTotalMinutes / 60)}h ${monthTotalMinutes % 60}m`,
//             averageDuration:
//               monthAvgMinutes < 60
//                 ? `${monthAvgMinutes}m`
//                 : `${Math.floor(monthAvgMinutes / 60)}h ${monthAvgMinutes % 60}m`,
//             weekdaysClocked: monthClockedDays, // ✅ how many weekdays he clocked this month
//             totalWeekdays: totalMonthWeekdays, // ✅ total weekdays in month up to today
//           },
//         },
//       },
//       { status: 200 }
//     )
//   } catch (error) {
//     const postgresError = handlePostgresError(error)
//     if (postgresError) return postgresError
//     return Response.json({ error: "Internal server error" }, { status: 500 })
//   }
// })

export const GET = RouteGuard.requireAuth(async (req) => {
  try {
    const authReq = req as AuthReqType
    const { searchParams } = new URL(req.url)
    const todayDate = new Date()
    const monthOffset = +(searchParams.get("month") || todayDate.getMonth())

    const yearOffset = +(searchParams.get("year") || todayDate.getFullYear())

    const startOfMonth = new Date(yearOffset, monthOffset - 1, 1)
    startOfMonth.setHours(0, 0, 0, 0)
    const endOfMonth = new Date(yearOffset, monthOffset, 0)
    endOfMonth.setHours(23, 59, 59, 999)

    const user = authReq.user

    const monthRecords = await db.query.attendance.findMany({
      where: and(
        eq(attendance.userId, user.id),
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

        console.log(attendanceMap, "record", record)

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
      (d) => d.status === "completed"
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
})
