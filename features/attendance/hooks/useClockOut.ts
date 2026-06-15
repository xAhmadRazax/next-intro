import { AttendanceType } from "@/db/schema"
import { clockOutApi } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { EmployeeAttendance } from "@/types/dashboard.types"
import { useState } from "react"
import { toast } from "sonner"

export function useClockOut() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function clockOutHandler(
    onSuccessCallbackHandler?: (params: EmployeeAttendance) => void
  ) {
    try {
      const res = await clockOutApi()

      if (res.attendance) {
        onSuccessCallbackHandler?.(res.attendance)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      if (error instanceof ApiError) {
        toast.error(error.message)
        setError(error.message)
      } else {
        setError("Something went wrong while clocking out ")
        toast.error("Something went wrong while clocking out")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    clockOutHandler,
  }
}
