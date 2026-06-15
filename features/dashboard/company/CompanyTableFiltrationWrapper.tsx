"use client"

import { useSearchParams } from "next/navigation"
import { CompanyTableFiltration } from "./CompanyTableFiltration"

export const CompanyTableFiltrationWrapper = ({
  disabled = false,
}: {
  disabled?: boolean
}) => {
  const searchParams = useSearchParams()
  return (
    <CompanyTableFiltration
      key={searchParams?.toString()}
      disabled={disabled}
    />
  )
}
