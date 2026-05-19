export interface PaginationMeta {
  nextPage: number | null
  prevPage: number | null
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  currentPage: number
  itemsPerPage: number
}
