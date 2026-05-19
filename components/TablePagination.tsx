import { usePathname, useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

// components/TablePagination.tsx
interface TablePaginationProps {
  totalPages: number
  currentPage: number
  prefetchNextHandler?: () => void
  prefetchPrevHandler?: () => void
  isLoading?: boolean
  labels?: {
    showing?: string
    of?: string
    pages?: string
    noPages?: string
  }
  className?: string
}

export function TablePagination({
  totalPages,
  currentPage,
  isLoading = false,
  prefetchNextHandler,
  prefetchPrevHandler,
  labels = {
    showing: "Showing",
    of: "of",
    pages: "pages",
    noPages: "No pages to display",
  },
  className = "",
}: TablePaginationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return
    if (newPage < 1 || newPage > totalPages) return

    const params = new URLSearchParams(searchParams?.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="text-sm text-foreground/80">
        {totalPages > 0
          ? `${labels.showing} ${currentPage} ${labels.of} ${totalPages} ${labels.pages}`
          : labels.noPages}
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage - 1)
              }}
              onMouseEnter={() => prefetchPrevHandler?.()}
              onFocus={() => prefetchPrevHandler?.()}
              onTouchStart={() => prefetchPrevHandler?.()}
              className={
                currentPage === 1 || isLoading
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage + 1)
              }}
              onMouseEnter={() => prefetchNextHandler?.()}
              onFocus={() => prefetchNextHandler?.()}
              onTouchStart={() => prefetchNextHandler?.()}
              className={
                currentPage === totalPages || isLoading
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
