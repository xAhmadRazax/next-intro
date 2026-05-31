import { resetEmployeePassword } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function useResetEmployeePasswordMutation() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function resetEmployeePasswordMutationHandler(
    id: string,
    onSuccessCallbackHandler?: () => void
  ) {
    setIsLoading(true)
    try {
      await resetEmployeePassword(id)
      onSuccessCallbackHandler?.()
      router.refresh()
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
        setError(error.message)
      } else {
        setError("Something went wrong while resetting employee password")
        toast.error("Something went wrong while resetting employee password")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, resetEmployeePasswordMutationHandler, error }
}
