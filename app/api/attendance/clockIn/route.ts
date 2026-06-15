import { db } from "@/db"
import { attendance } from "@/db/schema"
import { DaysArr, toLocalDateString } from "@/lib/date-util"
import { RouteGuard } from "@/lib/routeGuard.server"
import { AuthReqType } from "@/types/authReq.type"

export const POST = RouteGuard.requireAuth(async (req: AuthReqType) => {
  const user = req.user

  if (!user.companyId) {
    return Response.json(
      { error: "user has not been assign any company" },
      { status: 401 }
    )
  }

  const [checkedInRec] = await db
    .insert(attendance)
    .values({
      userId: user.id,
      companyId: user.companyId,
      checkIn: new Date(),
    })
    .returning()

  if (!checkedInRec.id) {
    return Response.json(
      { error: "something went wrong while clocking in" },
      { status: 500 }
    )
  }

  const formattedData = {
    id: checkedInRec.id,
    checkIn: checkedInRec.checkIn?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    checkOut: null,
    date: toLocalDateString(checkedInRec.createdAt!),
    day: DaysArr.at(checkedInRec.createdAt!.getDay() - 1),
    duration: null,
    isFuture: false,
    isToday: true,
    isWeekend: false,
    status: "active",
  }

  return Response.json({ attendance: formattedData }, { status: 200 })
})
