"use client"

import { CompanyTableFiltrationTest } from "./CompanyTableFiltrationTest"

export const CompanyTableFiltrationWrapperTest = ({
  disabled = false,
  updateFilters,
  filters,
}: {
  disabled?: boolean
  updateFilters: (filters: { name?: string; email?: string }) => void
  filters: { name?: string; email?: string }
}) => {
  return (
    <CompanyTableFiltrationTest
      key={`${filters.name}-${filters.email}`}
      updateFilters={updateFilters}
      filters={filters}
      disabled={disabled}
    />
  )
}
