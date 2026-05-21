"use client"

import { useSearchParams } from "next/navigation"
import { EmployeeTableFiltration } from "./EmployeeTableFiltration"
export const EmployeeTableFiltrationWrapper = () => {
  const searchParams = useSearchParams()
  return <EmployeeTableFiltration key={searchParams?.toString()} />
}
