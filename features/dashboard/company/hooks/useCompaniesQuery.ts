"use client"

import { getCompanies } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
import { CompanyType } from "@/types/dashboard.types"
import { PaginationMeta } from "@/types/pagination.types"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export const useCompaniesQuery = ({
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
  initialFetchedItems?: CompanyType[]
  initialFetchedMeta?: PaginationMeta
} = {}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setIsError] = useState("")

  const cachedCompanies = useRef<{
    items: CompanyType[]
    meta: PaginationMeta
    loadedPages: Set<number>
    currentPage: number
  }>({
    items: initialFetchedItems ?? [],
    loadedPages: initialFetchedItems ? new Set([1]) : new Set(),
    currentPage: 1,
    meta: initialFetchedMeta,
  })

  const [companies, setCompanies] = useState<{
    items: CompanyType[]
    meta: PaginationMeta
  }>(() => ({ items: initialFetchedItems ?? [], meta: initialFetchedMeta }))

  const companiesQueryHandler = async ({
    page = 1,
    getAll = false,
  }: {
    page?: number
    getAll?: boolean
  }) => {
    setIsLoading(true)
    try {
      const res = await getCompanies({ page, getAll: getAll })
      return res.companies
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
        setIsError(error.message)
      } else {
        setIsError("Something went wrong while fetching data")
        toast.error("Something went wrong while fetching data")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (id: string) => {
    // Guard: ensure we have data
    if (
      !cachedCompanies.current.items?.length ||
      !cachedCompanies.current.meta
    ) {
      return
    }

    const { meta, items } = cachedCompanies.current
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
    cachedCompanies.current.items = filteredItems
    cachedCompanies.current.meta = {
      ...meta,
      currentPage: newPage,
      totalPages: newTotalPages,
      hasNext: newPage < newTotalPages,
      hasPrev: newPage > 1,
      nextPage: newPage < newTotalPages ? newPage + 1 : null,
      prevPage: newPage > 1 ? newPage - 1 : null,
    }

    // Update state
    setCompanies({
      items: pageItems,
      meta: cachedCompanies.current.meta,
    })

    // Navigate if page changed
    if (newPage !== currentPage) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.push(`/dashboard/companies?page=${newPage}`)
    }
  }

  const addNewCompany = (company: CompanyType) => {
    if (!company.id) return

    const { meta, items } = cachedCompanies.current
    const { itemsPerPage, currentPage } = meta

    // Add to cache
    const updatedItems = [...items, company]
    cachedCompanies.current.items = updatedItems

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

    cachedCompanies.current.meta = newMeta
    cachedCompanies.current.loadedPages.add(currentPage)
    setCompanies({ items: pageItems, meta: newMeta })
  }

  const mutateExistingCompany = (company: CompanyType) => {
    // Guard: ensure it data exist
    if (!company.id) {
      return
    }

    const { items } = cachedCompanies.current

    // updating the item
    const updatedItems = items.map((item) => {
      if (item.id === company.id) {
        return company
      }

      // updating items in the cache
      cachedCompanies.current.items = updatedItems

      // updating state
      setCompanies((prev) => ({
        ...prev,
        items: updatedItems,
      }))

      return item
    })
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchCompanies = async () => {
      const page = Number(searchParams.get("page") ?? 1)
      const name = searchParams.get("name") ?? ""
      const email = searchParams.get("email") ?? ""
      const hasFilters = !!(name || email)

      try {
        // Check cache for non-filtered requests
        if (!hasFilters && cachedCompanies.current.loadedPages.has(page)) {
          const { items, meta } = cachedCompanies.current
          const itemsPerPage = meta.itemsPerPage
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage

          setCompanies({
            items: items.slice(start, end),
            meta: {
              ...meta,
              currentPage: page,
            },
          })
          return
        }

        setIsLoading(true)

        const response = await getCompanies(
          {
            page,
            nameFilter: name || undefined,
            emailFilter: email || undefined,
          },
          controller.signal
        )

        // Cache only non-filtered results
        if (!hasFilters) {
          const { companies, meta } = response
          const currentItems = cachedCompanies.current.items || []

          // Merge and deduplicate items
          const itemMap = new Map<string, CompanyType>()

          // Add existing items
          currentItems.forEach((item) => {
            if (item.id) itemMap.set(item.id, item)
          })

          // Add/overwrite with new items
          companies.forEach((item) => {
            if (item.id) itemMap.set(item.id, item)
          })

          // Convert back to array and sort by createdAt
          const mergedItems = Array.from(itemMap.values()).sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateA - dateB
          })

          cachedCompanies.current = {
            items: mergedItems,
            loadedPages: new Set([
              ...cachedCompanies.current.loadedPages,
              meta.currentPage,
            ]),
            meta: meta,
            currentPage: meta.currentPage,
          }
        }

        setCompanies({
          items: response.companies,
          meta: response.meta,
        })
      } catch (error) {
        // Ignore abort errors
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        const errorMessage =
          error instanceof ApiError
            ? error.message
            : "Failed to fetch companies"

        setIsError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()

    return () => controller.abort()
  }, [searchParams])

  return {
    companiesQueryHandler,
    isLoading,
    error,
    companies,
    removeItem,
    addNewCompany,
    mutateExistingCompany,
  }
}
