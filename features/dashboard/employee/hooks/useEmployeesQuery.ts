"use client"

import { PublicUserType } from "@/db/schema"
import { getEmployees } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { EmployeeQueryType } from "@/types/dashboard.types"
import { PaginationMeta } from "@/types/pagination.types"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export const useEmployeesQuery = ({
  initialFetchedItems = [],
  initialFetchedMeta = {
    nextPage: null,
    prevPage: null,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    currentPage: 1,
    itemsPerPage: 20,
  },
}: {
  initialFetchedItems?: EmployeeQueryType[]
  initialFetchedMeta?: PaginationMeta
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setIsError] = useState("")

  const cachedEmployees = useRef<{
    items: EmployeeQueryType[]
    meta: PaginationMeta
    loadedPages: Set<number>
    currentPage: number
  }>({
    items: initialFetchedItems ?? [],
    loadedPages: initialFetchedItems.length > 0 ? new Set([1]) : new Set(),
    currentPage: 1,
    meta: initialFetchedMeta,
  })

  const [employees, setEmployees] = useState<{
    items: EmployeeQueryType[]
    meta: PaginationMeta
  }>(() => {
    return { items: initialFetchedItems, meta: initialFetchedMeta }
  })

  useEffect(() => {
    const employeesQueryHandler = async ({
      pageFilter = 1,
      nameFilter = "",
      emailFilter = "",
      companyFilter = "",
      signal,
    }: {
      signal?: AbortSignal
      pageFilter?: number
      nameFilter?: string
      emailFilter?: string
      companyFilter?: string
    }) => {
      // const isMounted = true
      // read data from cache if it exist and change the current snapshot of items
      if (
        cachedEmployees.current &&
        cachedEmployees.current.loadedPages.has(pageFilter) &&
        !emailFilter &&
        !nameFilter &&
        !companyFilter
      ) {
        //  so whats the plan this should hard XDDDD

        const start =
          (pageFilter - 1) * cachedEmployees.current.meta.itemsPerPage
        const end = start + cachedEmployees.current.meta.itemsPerPage

        setEmployees({
          items: cachedEmployees.current.items.slice(start, end),
          meta: {
            ...cachedEmployees.current.meta,
            currentPage: pageFilter,
            totalPages: cachedEmployees.current.meta.totalPages ?? 1,
          },
        })
        return
      }

      setIsLoading(true)
      try {
        const res = await getEmployees(
          {
            page: pageFilter,
            usernameFilter: nameFilter,
            emailFilter,
            companyFilter,
          },
          signal
        )

        // caching records when there is not any filters set
        if (
          !emailFilter &&
          !nameFilter &&
          !companyFilter &&
          res.data.length > 0
        ) {
          cachedEmployees.current = {
            items: [...cachedEmployees.current.items, ...res.data].sort(
              (a, b) => {
                return a.createdAt!.getTime() - b.createdAt!.getTime()
              }
            ),

            loadedPages: cachedEmployees.current.loadedPages.add(
              res.meta.currentPage
            ),

            meta: res.meta,
            currentPage: res.meta.currentPage,
          }
        }

        setEmployees({ items: res.data, meta: res.meta })
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        if (error instanceof ApiError) {
          toast.error(error.message)
          setIsError(error.message)
        } else {
          setIsError("Something went wrong while fetching data")
          toast.error("Something went wrong while fetching data")
        }
      } finally {
        // if (isMounted)
        setIsLoading(false)
      }
    }

    const controller = new AbortController()
    const pageFilter = Number(searchParams.get("page") ?? 1)
    const emailFilter = searchParams.get("email") ?? undefined
    const nameFilter = searchParams.get("username") ?? undefined
    const companyFilter = searchParams.get("company") ?? undefined

    employeesQueryHandler({
      pageFilter,
      emailFilter,
      companyFilter,
      nameFilter,
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [searchParams])

  const deleteCachedEmployee = async (id: string) => {
    // guard that check for some reason if we have no employee data then
    // this function wil do nothing
    if (
      !cachedEmployees?.current.items ||
      !cachedEmployees.current.items.length ||
      !cachedEmployees.current.meta
    ) {
      return
    }

    const filteredCachedEmployees = cachedEmployees?.current?.items.filter(
      (item) => {
        console.log(item.id !== id, item.id, id)
        return item.id !== id
      }
    )

    const currentCachedPages = Math.ceil(
      (filteredCachedEmployees?.length ?? 1) /
        (cachedEmployees?.current.meta.itemsPerPage ?? 1)
    )

    const currentPage = cachedEmployees?.current.meta?.currentPage ?? 1

    const itemSnapshotStartIndex =
      (currentPage - 1) * (cachedEmployees?.current.meta?.itemsPerPage ?? 20)

    const itemSnapshotEndIndex =
      itemSnapshotStartIndex +
      (cachedEmployees?.current.meta?.itemsPerPage ?? 20)

    const pageItemSnapshot = filteredCachedEmployees.slice(
      itemSnapshotStartIndex,
      itemSnapshotEndIndex
    )

    let hasNext = (cachedEmployees?.current.meta.totalPages ?? 1) < currentPage

    // handing edge case where we have more than ona page
    // and any page that are 2+ could have only 1 record
    if (
      cachedEmployees.current.meta.currentPage &&
      cachedEmployees.current.meta.currentPage > 1
    ) {
      if (pageItemSnapshot?.length === 0) {
        setEmployees((prevData) => ({
          items: prevData?.items ?? [],
          meta: {
            currentPage: prevData?.meta.currentPage ?? 1,
            itemsPerPage: prevData?.meta.itemsPerPage ?? 10,
            totalPages: (prevData?.meta.totalPages ?? 1) - 1,
            hasNext: prevData?.meta.hasNext ?? false,
            hasPrev: prevData?.meta.hasPrev ?? false,
            nextPage: prevData?.meta.nextPage ?? null, // Explicitly handle nextPage
            prevPage: prevData?.meta.prevPage ?? null,
          },
        }))
      }

      cachedEmployees.current.loadedPages.delete(
        cachedEmployees.current.meta.currentPage
      )
      hasNext = (cachedEmployees.current?.meta.totalPages ?? 1) < currentPage

      const params = new URLSearchParams(searchParams.toString())

      params.set(
        "page",
        (cachedEmployees.current.meta.currentPage > 1
          ? cachedEmployees.current.meta.currentPage - 1
          : 1
        ).toString()
      )

      cachedEmployees.current.meta.totalPages =
        cachedEmployees.current.meta.totalPages > 1
          ? cachedEmployees.current.meta.totalPages - 1
          : 1

      return router.push(`/dashboard/employees?page=1`)
    }

    cachedEmployees.current.items = filteredCachedEmployees

    console.log(cachedEmployees, pageItemSnapshot)
    // setEmployees({
    //   items: pageItemSnapshot,
    //   meta: {
    //     ...cachedEmployees?.current.meta,
    //     currentPage: currentPage,
    //     hasNext,
    //     totalPages: currentCachedPages - 1 > 0 ? currentCachedPages - 1 : 1,
    //   },
    // })

    return router.push(
      `/dashboard/employees?page=${cachedEmployees.current.meta.currentPage}`
    )
    // })
    // }
  }

  const addEmployeeToCache = (employee: PublicUserType) => {
    if (!employee.id) {
      return
    }

    cachedEmployees.current.items.push(employee)

    const totalPages = Math.ceil(
      cachedEmployees.current.items.length /
        cachedEmployees.current.meta.itemsPerPage
    )

    cachedEmployees.current.meta.totalPages = totalPages

    console.log(cachedEmployees)

    router.push(`/dashboard/employees?page=${employees?.meta.totalPages}`)
  }

  const updateEmployeeInCache = (employee: PublicUserType) => {
    if (!employee.id) {
      return
    }

    cachedEmployees.current.items = cachedEmployees.current.items.map(
      (item) => {
        if (item.id === employee.id) {
          return { ...item, ...employee, stats: item.stats }
        }

        return item
      }
    )

    // router.push(
    //   `/dashboard/employees?page=${cachedEmployees.current.meta.currentPage}`
    // )
    router.refresh()
  }

  return {
    isLoading,
    error,
    employees,
    addEmployeeToCache,
    deleteCachedEmployee,
    updateEmployeeInCache,
  }
}
