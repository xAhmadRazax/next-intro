"use client"

import { CompanyType } from "@/db/schema"
import { getCompanies } from "@/lib/api"
import { ApiError } from "@/lib/apiError"
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
      return res.data
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
    // guard that check for some reason if we have no companies data then
    // this function wil do nothing
    if (
      !cachedCompanies?.current.items ||
      !cachedCompanies.current.items.length ||
      !cachedCompanies.current.meta
    ) {
      return
    }

    const filteredCachedCompanies = cachedCompanies?.current?.items.filter(
      (item) => {
        console.log(item.id !== id, item.id, id)
        return item.id !== id
      }
    )

    const currentCachedPages = Math.ceil(
      (filteredCachedCompanies?.length ?? 1) /
        (cachedCompanies?.current.meta.itemsPerPage ?? 1)
    )

    const currentPage = cachedCompanies?.current.meta?.currentPage ?? 1

    const itemSnapshotStartIndex =
      (currentPage - 1) * (cachedCompanies?.current.meta?.itemsPerPage ?? 20)

    const itemSnapshotEndIndex =
      itemSnapshotStartIndex +
      (cachedCompanies?.current.meta?.itemsPerPage ?? 20)

    const pageItemSnapshot = filteredCachedCompanies.slice(
      itemSnapshotStartIndex,
      itemSnapshotEndIndex
    )

    let hasNext = (cachedCompanies?.current.meta.totalPages ?? 1) < currentPage
    console.log(
      "current total Page",
      currentCachedPages,
      "currentPAge",
      currentPage,
      "item start",
      itemSnapshotStartIndex,
      "item end",
      itemSnapshotEndIndex,
      pageItemSnapshot
    )

    // handing edge case where we have more than ona page
    // and any page that are 2+ could have only 1 record
    if (
      cachedCompanies.current.meta.currentPage &&
      cachedCompanies.current.meta.currentPage > 1
    ) {
      if (pageItemSnapshot?.length === 0) {
        // currentPage = -1
        // itemSnapshotStartIndex =
        //   (currentPage - 1) * (cachedCompanies.current.meta?.itemsPerPage ?? 20)
        // itemSnapshotEndIndex =
        //   itemSnapshotStartIndex +
        //   (cachedCompanies.current.meta?.itemsPerPage ?? 20)

        setCompanies((prevData) => ({
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

      cachedCompanies.current.loadedPages.delete(
        cachedCompanies.current.meta.currentPage
      )
      hasNext = (cachedCompanies.current?.meta.totalPages ?? 1) < currentPage

      const params = new URLSearchParams(searchParams.toString())

      params.set(
        "page",
        (cachedCompanies.current.meta.currentPage > 1
          ? cachedCompanies.current.meta.currentPage - 1
          : 1
        ).toString()
      )

      cachedCompanies.current.meta.totalPages =
        cachedCompanies.current.meta.totalPages > 1
          ? cachedCompanies.current.meta.totalPages - 1
          : 1

      return router.push(`/dashboard/companies?page=1`)
    }

    cachedCompanies.current.items = filteredCachedCompanies
    return setCompanies({
      items: pageItemSnapshot,
      meta: {
        ...cachedCompanies?.current.meta,
        currentPage: currentPage,
        hasNext,
        totalPages: currentCachedPages - 1 > 0 ? currentCachedPages - 1 : 1,
      },
    })
    // })
    // }
  }

  const addNewCompany = (company: CompanyType) => {
    if (!company.id) {
      return
    }

    cachedCompanies.current.items.push(company)

    const totalPages = Math.ceil(
      cachedCompanies.current.items.length /
        cachedCompanies.current.meta.itemsPerPage
    )

    cachedCompanies.current.meta.totalPages = totalPages

    router.push(`/dashboard/companies?page=${companies?.meta.totalPages}`)
  }

  const mutateExistingCompany = (company: CompanyType) => {
    if (!company.id) {
      return
    }

    cachedCompanies.current.items = cachedCompanies.current.items.map(
      (item) => {
        if (item.id === company.id) {
          return company
        }

        return item
      }
    )

    router.push(
      `/dashboard/companies?page=${cachedCompanies.current.meta.currentPage}`
    )
  }

  useEffect(() => {
    const companiesQueryHandler = async ({
      page = 1,
      name = "",
      email = "",
      signal,
    }: {
      signal?: AbortSignal
      page?: number
      name?: string
      email?: string
    }) => {
      try {
        // checking if current page data exist in the pagination if it exist switch current set item to this cached items
        // and there isnt any filtration set for email and name

        if (
          cachedCompanies.current &&
          cachedCompanies.current.loadedPages.has(+(page ?? 1)) &&
          !name &&
          !email
        ) {
          // const totalPages = Math.ceil(
          //   cachedCompanies.current.items.length /
          //     cachedCompanies.current.meta.itemsPerPage
          // )

          const start = (page - 1) * cachedCompanies.current.meta.itemsPerPage
          const end = start + cachedCompanies.current.meta.itemsPerPage

          setCompanies({
            items: cachedCompanies.current.items.slice(start, end),
            meta: {
              ...cachedCompanies.current.meta,
              currentPage: page,
              totalPages: cachedCompanies.current.meta.totalPages ?? 1,
            },
          })
          return
        }

        setIsLoading(true)
        const res = await getCompanies(
          { page, nameFilter: name, emailFilter: email },
          signal
        )
        console.log("calling on the client")
        // caching main records
        if (!name && !email) {
          const updatedLoadedPages = cachedCompanies?.current.loadedPages
          // Add the current page to the Set
          updatedLoadedPages.add(res.meta.currentPage)
          cachedCompanies.current = {
            items:
              cachedCompanies.current?.items &&
              cachedCompanies.current.items.length > 0
                ? [...cachedCompanies.current.items, ...res.data].sort(
                    (a, b) => {
                      const aCreatedAt = a.createdAt
                        ? new Date(a.createdAt).getTime()
                        : 0
                      const bCreatedAt = b.createdAt
                        ? new Date(b.createdAt).getTime()
                        : 0
                      return aCreatedAt - bCreatedAt
                    }
                  )
                : res.data,
            loadedPages: updatedLoadedPages,
            meta: res.meta,
            currentPage: res.meta.currentPage,
          }
        }

        setCompanies({ items: res.data, meta: res.meta })
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
        setIsLoading(false)
      }
    }

    const controller = new AbortController()
    const pageParams = Number(searchParams.get("page") ?? 1)
    const emailParams = searchParams.get("email")
    const nameParams = searchParams.get("name")

    companiesQueryHandler({
      page: pageParams,
      email: emailParams ?? undefined,
      name: nameParams ?? undefined,
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [searchParams])

  const getCurrentPageCompanies = () => {
    // if (!companies?.meta)
    //   return {
    //     companies: [],
    //     meta: null,
    //   }
    // const start = (companies.currentPage - 1) * companies.meta.itemsPerPage
    // const end = start + companies.meta.itemsPerPage
    // return {
    //   companies: companies.companies.slice(start, end),
    //   meta: companies.meta,
    // }
  }

  return {
    companiesQueryHandler,
    isLoading,
    error,
    companies,
    getCurrentPageCompanies,
    removeItem,
    addNewCompany,
    mutateExistingCompany,
  }
}
