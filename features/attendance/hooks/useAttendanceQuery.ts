import { getUserAttendance } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import {
  EmployeeAttendance,
  EmployeeAttendanceQueryType,
} from "@/types/dashboard.types"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function useAttendanceQuery(
  {
    initialTotalAttendance,
  }: {
    initialTotalAttendance: EmployeeAttendance[]
  },
  filters: {
    month: number
    year: number
    status: string
  }
) {
  // const cachedAtte

  const cachedAttendance = useRef<{
    items: Map<string, EmployeeAttendanceQueryType>
  }>({
    items:
      initialTotalAttendance.length > 0
        ? new Map().set(
            `${filters.month + 1}-${filters.year}`,
            initialTotalAttendance
          )
        : new Map(),
  })

  const [attendance, setAttendance] = useState<{
    totalAttendance: EmployeeAttendance[]
    todayAttendance?: EmployeeAttendance
  } | null>({
    totalAttendance: initialTotalAttendance,
    todayAttendance: initialTotalAttendance?.find((att) => {
      return att?.isToday
    }),
  })

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState("")
  const onClockIn = (newRecord: EmployeeAttendance) => {
    setAttendance((prev) => {
      if (!prev) return prev

      const updatedAttendance = prev.totalAttendance.map((day) => {
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
        totalAttendance: updatedAttendance,

        todayAttendance: newRecord,
      }
    })
  }
  const onClockOut = (newRecord: EmployeeAttendance) => {
    setAttendance((prev) => {
      if (!prev) return prev

      const updatedAttendance = prev.totalAttendance.map((day) => {
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
        totalAttendance: updatedAttendance,
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
        if (
          cachedAttendance.current.items.has(
            `${filters.month + 1}-${filters.year}`
          )
        ) {
          setAttendance({
            totalAttendance:
              filters?.status !== "All"
                ? cachedAttendance.current.items
                    .get(`${filters.month + 1}-${filters.year}`)!
                    .attendance.filter(
                      (el) => el.status === filters.status.toLocaleLowerCase()
                    )
                : cachedAttendance.current.items.get(
                    `${filters.month + 1}-${filters.year}`
                  )!.attendance,
          })
        }
        const res = await getUserAttendance(filters, signal)

        const todayAttendance = res?.attendance?.find((att) => {
          return att?.isToday
        })

        if (res.attendance.length > 0) {
          cachedAttendance.current.items.set(
            `${filters.month + 1}-${filters.year}`,
            res
          )
        }

        if (filters.status !== "All") {
          return setAttendance({
            totalAttendance: res.attendance.filter((el) => {
              return el.status === filters.status.toLocaleLowerCase()
            }),

            todayAttendance: todayAttendance ?? undefined,
          })
        }

        setAttendance({
          totalAttendance: res.attendance,
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
  }, [filters])

  return { attendance, isLoading, error, onClockIn, onClockOut }
}
