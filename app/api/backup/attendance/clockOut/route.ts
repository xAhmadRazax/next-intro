import { db } from "@/db"
import { attendance } from "@/db/schema"
import { DaysArr, toLocalDateString } from "@/lib/date-util"
import { handlePostgresError } from "@/lib/drizzle-error-handler.server"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"
import { eq, and, isNull, gte, lte } from "drizzle-orm"

export const POST = RouteGuard.requireAuth(async (req: Request) => {
  try {
    const authReq = req as AuthReqType
    const user = authReq.user

    if (!user.companyId) {
      return Response.json(
        { error: "User has not been assigned any company" },
        { status: 401 }
      )
    }

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const existingRecord = await db.query.attendance.findFirst({
      where: and(
        eq(attendance.userId, user.id),
        eq(attendance.companyId, user.companyId),
        isNull(attendance.checkOut),
        gte(attendance.checkIn, startOfDay),
        lte(attendance.checkIn, endOfDay)
      ),
    })

    if (!existingRecord) {
      return Response.json(
        { error: "No active check in found for today" },
        { status: 404 }
      )
    }

    const [updatedRecord] = await db
      .update(attendance)
      .set({ checkOut: new Date() })
      .where(eq(attendance.id, existingRecord.id))
      .returning()

    // ✅ calculate duration
    const checkInDate = new Date(updatedRecord.checkIn!)
    const checkOutDate = new Date(updatedRecord.checkOut!)
    const mins = Math.round(
      (checkOutDate.getTime() - checkInDate.getTime()) / 60000
    )
    const duration =
      mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`

    // ✅ same formatted response as clock in
    const formattedData = {
      id: updatedRecord.id,
      checkIn: checkInDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      checkOut: checkOutDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: toLocalDateString(updatedRecord.createdAt!),
      day: DaysArr.at(updatedRecord.createdAt!.getDay() - 1),
      duration,
      isFuture: false,
      isToday: true,
      isWeekend: false,
      status: "completed",
    }

    return Response.json({ attendance: formattedData }, { status: 200 })
  } catch (error) {
    const postgresError = handlePostgresError(error)
    if (postgresError) return postgresError
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
})
