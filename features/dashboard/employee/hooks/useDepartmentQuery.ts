import { getDepartmentsWithRoles } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { DepartmentsWithRolesType } from "@/types/dashboard.types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function useDepartmentsQuery() {
  const [departments, setDepartments] = useState<
    DepartmentsWithRolesType[] | null
  >(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchDepartment() {
      setIsLoading(true)
      try {
        const departmentsRecs = await getDepartmentsWithRoles()

        setDepartments(departmentsRecs)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        if (error instanceof ApiError) {
          toast.error(error.message)
          setError(error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartment()
  }, [])

  return { departments, isLoading, error }
}
