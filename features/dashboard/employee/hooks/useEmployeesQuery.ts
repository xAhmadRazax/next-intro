"use client"

import { PublicUserType } from "@/db/schema"
import { getEmployees } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { EmployeeQueryType, EmployeeType } from "@/types/dashboard.types"
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
  initialFetchedItems?: EmployeeType[]
  initialFetchedMeta?: PaginationMeta
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setIsError] = useState("")

  const cachedEmployees = useRef<{
    items: EmployeeType[]
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
    items: EmployeeType[]
    meta: PaginationMeta
  }>(() => {
    return { items: initialFetchedItems, meta: initialFetchedMeta }
  })

  useEffect(() => {
    const controller = new AbortController()

    const fetchEmployees = async () => {
      const page = Number(searchParams.get("page") ?? 1)
      const name = searchParams.get("username") ?? ""
      const email = searchParams.get("email") ?? ""
      const company = searchParams.get("company") ?? ""
      const hasFilters = !!(name || email || company)

      try {
        // Check cache for non-filtered requests
        if (!hasFilters && cachedEmployees.current.loadedPages.has(page)) {
          const { items, meta } = cachedEmployees.current
          const itemsPerPage = meta.itemsPerPage
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage

          setEmployees({
            items: items.slice(start, end),
            meta: {
              ...meta,
              currentPage: page,
            },
          })
          return
        }

        setIsLoading(true)

        const response = await getEmployees(
          {
            page,
            usernameFilter: name || undefined,
            emailFilter: email || undefined,
            companyFilter: company || undefined,
          },
          controller.signal
        )

        // Cache only non-filtered results with data
        if (!hasFilters && response.data.length > 0) {
          const { data, meta } = response
          const currentItems = cachedEmployees.current.items || []

          // Merge and deduplicate items

          const itemMap = new Map<string, EmployeeType>()

          // Add existing items
          currentItems.forEach((item) => {
            if (item.id) itemMap.set(item.id, item)
          })

          // Add/overwrite with new items
          data.forEach((item) => {
            if (item.id) itemMap.set(item.id, item)
          })

          // Convert back to array and sort by createdAt
          const mergedItems = Array.from(itemMap.values()).sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateA - dateB
          })

          cachedEmployees.current = {
            items: mergedItems,
            loadedPages: new Set([
              ...cachedEmployees.current.loadedPages,
              meta.currentPage,
            ]),
            meta: meta,
            currentPage: meta.currentPage,
          }
        }

        setEmployees({
          items: response.data,
          meta: response.meta,
        })
      } catch (error) {
        // Ignore abort errors
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        console.error("Error fetching employees:", error)

        const errorMessage =
          error instanceof ApiError
            ? error.message
            : "Failed to fetch employees"

        setIsError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()

    return () => controller.abort()
  }, [searchParams])

  const deleteCachedEmployee = async (id: string) => {
    if (
      !cachedEmployees.current.items?.length ||
      !cachedEmployees.current.meta
    ) {
      return
    }

    const { meta, items } = cachedEmployees.current
    const itemsPerPage = meta.itemsPerPage
    const currentPage = meta.currentPage

    // Filter out the removed item
    const filteredItems = items.filter((item) => item.id !== id)

    // Calculate new total pages
    const newTotalPages = Math.max(
      1,
      Math.ceil(filteredItems.length / itemsPerPage)
    )

    // Determine the page to display after removal
    let newPage = currentPage
    if (currentPage > newTotalPages) {
      newPage = newTotalPages // Go to last page if current page is now empty
    }

    // Calculate the slice for the new current page
    const startIndex = (newPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const pageItems = filteredItems.slice(startIndex, endIndex)

    // Update cache
    cachedEmployees.current.items = filteredItems
    cachedEmployees.current.meta = {
      ...meta,
      currentPage: newPage,
      totalPages: newTotalPages,
      hasNext: newPage < newTotalPages,
      hasPrev: newPage > 1,
      nextPage: newPage < newTotalPages ? newPage + 1 : null,
      prevPage: newPage > 1 ? newPage - 1 : null,
    }

    // Update state
    setEmployees({
      items: pageItems,
      meta: cachedEmployees.current.meta,
    })

    // Navigate if page changed
    if (newPage !== currentPage) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.push(`/dashboard/employees?page=${newPage}`)
    }
  }

  const addEmployeeToCache = (employee: EmployeeType) => {
    if (!employee.id) return

    const { meta, items } = cachedEmployees.current
    const { itemsPerPage, currentPage } = meta

    // Add to cache
    const updatedItems = [...items, employee]
    cachedEmployees.current.items = updatedItems

    // Recalculate total pages from cached items
    const newTotalPages = Math.max(
      1,
      Math.ceil(updatedItems.length / itemsPerPage)
    )

    // Re-slice the same current page — no navigation
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const pageItems = updatedItems.slice(startIndex, endIndex)

    const newMeta: PaginationMeta = {
      ...meta,
      totalPages: newTotalPages,
      hasNext: currentPage < newTotalPages,
      hasPrev: currentPage > 1,
      nextPage: currentPage < newTotalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
    }

    cachedEmployees.current.meta = newMeta
    cachedEmployees.current.loadedPages.add(currentPage)
    setEmployees({ items: pageItems, meta: newMeta })
  }

  const updateEmployeeInCache = (employee: EmployeeType) => {
    if (!employee.id) {
      return
    }

    const { items } = cachedEmployees.current

    // updating the item
    const updatedItems = items.map((item) => {
      if (item.id === employee.id) {
        return employee
      }

      // updating items in the cache
      cachedEmployees.current.items = updatedItems

      // updating state
      setEmployees((prev) => ({
        ...prev,
        items: updatedItems,
      }))

      return item
    })
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
