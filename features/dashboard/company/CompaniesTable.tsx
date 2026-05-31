"use client"

import { DataTable } from "../components/DataGridTable"
import { companyColumns } from "./company-columns"
import { DataTablePaginationWrapper } from "../components/DataTablePaginationWrapper"
import { TablePagination } from "@/components/TablePagination"
import { useCompaniesQuery } from "./hooks/useCompaniesQuery"
import { useSearchParams } from "next/navigation"
import { CompaniesTableSkeleton } from "./CompaniesTableSkeleton"

export const CompaniesTable = () => {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page"))

  const { companies: companiesDataWithPagMeta, isLoading } =
    useCompaniesQuery(page)

  if (isLoading || !companiesDataWithPagMeta) {
    return <CompaniesTableSkeleton rows={10} />
  }
  const { companies, meta } = companiesDataWithPagMeta
  return (
    <>
      {/* Filter Section - filters by name AND email */}
      {/* <DataTableFiltration /> */}
      <DataTable
        columns={companyColumns(
          false,
          (+meta.currentPage - 1) * +meta.itemsPerPage
        )}
        data={companies}
        headerRowStyle={
          "grid grid-cols-[auto,80px,minmax(150px,1fr),minmax(200px,1.5fr),minmax(200px,2fr)]"
        }
      />
      {meta && meta.totalPages > 1 && (
        <DataTablePaginationWrapper>
          <TablePagination
            totalPages={meta.totalPages}
            currentPage={meta.currentPage}
            isLoading={isLoading}
            // prefetchNextHandler={prefetchNextPage}
            // prefetchPrevHandler={prefetchPrevPage}
            labels={{
              showing: "Showing",
              of: "of",
              pages: "companies pages",
            }}
          />
        </DataTablePaginationWrapper>
      )}
    </>
  )
}
