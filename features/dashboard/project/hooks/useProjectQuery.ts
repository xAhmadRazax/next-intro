"use client"
import { ProjectType } from "@/db/schema"
import { getProjectsApi } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function useProjectQuery() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [projects, setProjects] = useState<ProjectType[] | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchProject = async (AbortSignal: AbortSignal) => {
      setIsLoading(true)
      try {
        const projects = await getProjectsApi({ signal: AbortSignal })

        setProjects(projects)
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

    const controller = new AbortController()

    fetchProject(controller.signal)

    return () => controller.abort()
  }, [])

  return { isLoading, error, projects, page }
}
