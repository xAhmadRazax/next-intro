import { getEmployeeAttendance } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { EmployeeAttendanceQueryType } from "@/types/dashboard.types"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function useAttendanceQuery(
  employeeId: string,
  filters: { month: number; year: number; status: string }
) {
  const cachedAttendance = useRef(
    new Map<string, EmployeeAttendanceQueryType>()
  )

  const [attendance, setAttendance] =
    useState<EmployeeAttendanceQueryType | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState("")

  useEffect(() => {
    const attendanceQueryHandler = async ({
      signal,
    }: {
      signal?: AbortSignal
    }) => {
      setIsLoading(true)
      try {
        if (
          cachedAttendance.current.has(
            `${employeeId}-${filters.month + 1}-${filters.year}`
          )
        ) {
          return setAttendance({
            summary: cachedAttendance.current.get(
              `${employeeId}-${filters.month + 1}-${filters.year}`
            )!.summary,
            attendance:
              filters?.status !== "All"
                ? cachedAttendance.current
                    .get(`${employeeId}-${filters.month + 1}-${filters.year}`)!
                    .attendance.filter(
                      (el) => el.status === filters.status.toLocaleLowerCase()
                    )
                : cachedAttendance.current.get(
                    `${employeeId}-${filters.month + 1}-${filters.year}`
                  )!.attendance,
          })
        }
        const res = await getEmployeeAttendance(employeeId, filters, signal)

        if (res.attendance.length > 0) {
          cachedAttendance.current.set(
            `${employeeId}-${filters.month + 1}-${filters.year}`,
            res
          )
        }

        if (filters.status !== "All") {
          return setAttendance({
            summary: res.summary,
            attendance: res.attendance.filter((el) => {
              return el.status === filters.status.toLocaleLowerCase()
            }),
          })
        }

        setAttendance(res)
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
  }, [employeeId, filters])

  return { attendance, isLoading, error }
}
