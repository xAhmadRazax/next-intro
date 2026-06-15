"use client"

import { useSearchParams } from "next/navigation"
import { EmployeeTableFiltration } from "./EmployeeTableFiltration"
export const EmployeeTableFiltrationWrapper = ({
  disabled = false,
}: {
  disabled?: boolean
}) => {
  const searchParams = useSearchParams()
  return (
    <EmployeeTableFiltration
      key={searchParams?.toString()}
      disabled={disabled}
    />
  )
}
