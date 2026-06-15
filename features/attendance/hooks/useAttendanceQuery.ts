import { AttendanceType } from "@/db/schema"
import { getUserAttendance } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import {
  EmployeeAttendance,
  EmployeeAttendanceQueryType,
} from "@/types/dashboard.types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function useAttendanceQuery() {
  const [attendance, setAttendance] = useState<{
    totalAttendance: EmployeeAttendanceQueryType
    todayAttendance?: EmployeeAttendance
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState("")
  const onClockIn = (newRecord: EmployeeAttendance) => {
    setAttendance((prev) => {
      if (!prev) return prev

      const updatedAttendance = prev.totalAttendance.attendance.map((day) => {
        if (day.isToday) {
          return {
            ...day,
            ...newRecord,
            status: "active" as const,
            checkOut: null,
            duration: null,
          }
        }
        return day
      })
      return {
        totalAttendance: {
          ...prev.totalAttendance,
          attendance: updatedAttendance,
        },
        todayAttendance: newRecord,
      }
    })
  }
  const onClockOut = (newRecord: EmployeeAttendance) => {
    setAttendance((prev) => {
      if (!prev) return prev

      const updatedAttendance = prev.totalAttendance.attendance.map((day) => {
        if (day.isToday) {
          return {
            ...day,
            ...newRecord,
            status: "completed" as const,
          } as EmployeeAttendance
        }
        return day
      }) as EmployeeAttendance[]

      return {
        totalAttendance: {
          ...prev.totalAttendance,
          attendance: updatedAttendance,
        },
        todayAttendance: newRecord,
      }
    })
  }

  useEffect(() => {
    const attendanceQueryHandler = async ({
      signal,
    }: {
      signal?: AbortSignal
    }) => {
      setIsLoading(true)
      try {
        const res = await getUserAttendance(signal)

        const todayAttendance = res?.attendance?.find((att) => {
          return att?.isToday
        })

        setAttendance({
          totalAttendance: res,
          todayAttendance: todayAttendance ?? undefined,
        })
      } catch (error) {
        console.log(error, "error")
        if (error instanceof DOMException && error.name === "AbortError") return
        if (error instanceof ApiError) {
          toast.error(error.message)
          setError(error.message)
        } else {
          setError("Something went wrong while fetching data")
          toast.error("Something went wrong while fetching data")
        }
      } finally {
        setIsLoading(false)
      }
    }

    const controller = new AbortController()

    attendanceQueryHandler(controller)

    return () => controller.abort()
  }, [])

  return { attendance, isLoading, error, onClockIn, onClockOut }
}
