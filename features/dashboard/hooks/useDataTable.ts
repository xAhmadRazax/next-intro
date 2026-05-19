"use client"
import { createContext, useContext } from "react"

export type DataTableContextType = {
  isLoading?: boolean
  isFetching?: boolean
  onRefresh?: () => void
}

export const DataTableContext = createContext<DataTableContextType | null>(null)

export function useDataTable() {
  const context = useContext(DataTableContext)

  if (!context) {
    throw new Error(
      "DataTable compound components must be used inside DataTable"
    )
  }

  return context
}
