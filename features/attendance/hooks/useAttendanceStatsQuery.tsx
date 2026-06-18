import { getUserAttendanceStats } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { EmployeeAttendanceStatsType } from "@/types/dashboard.types"
import { useState } from "react"
import { toast } from "sonner"

export function useAttendanceStatsQuery({
  initialAttendanceStats,
}: {
  initialAttendanceStats: EmployeeAttendanceStatsType
}) {
  const [attendanceStats, setAttendanceStats] = useState(initialAttendanceStats)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function fetchAttendanceStats() {
    setIsLoading(true)
    try {
      const res = await getUserAttendanceStats()
      console.log(res, "res----")
      setAttendanceStats(res)
    } catch (error) {
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

  return {
    attendanceStats,
    isLoading,
    fetchAttendanceStats,
  }
}
