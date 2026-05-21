"use client"

import { useSearchParams } from "next/navigation"
import { CompanyTableFiltration } from "./CompanyTableFiltration"

export const CompanyTableFiltrationWrapper = () => {
  const searchParams = useSearchParams()
  return <CompanyTableFiltration key={searchParams?.toString()} />
}
