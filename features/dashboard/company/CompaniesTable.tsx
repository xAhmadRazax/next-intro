"use client"

import { DataTable } from "../components/DataGridTable"
import { companyColumns } from "./company-columns"
import { DataTablePaginationWrapper } from "../components/DataTablePaginationWrapper"
import { TablePagination } from "@/components/TablePagination"
import { useCompaniesQuery } from "./hooks/useCompaniesQuery"
import { CompaniesTableSkeleton } from "./CompaniesTableSkeleton"
import { PaginationMeta } from "@/types/pagination.types"
import { CompanyType } from "@/types/dashboard.types"

export const CompaniesTable = ({
  isLoading,
  companiesDataWithPagMeta,
  removeItemCallback,
  mutateExistingCompanyCallback,
}: {
  isLoading: boolean
  companiesDataWithPagMeta: {
    items: CompanyType[]
    meta: PaginationMeta
  } | null

  removeItemCallback: (id: string) => void
  mutateExistingCompanyCallback: (company: CompanyType) => void
}) => {
  // const {
  //   companies: companiesDataWithPagMeta,
  //   isLoading,
  //   removeItem,
  // } = useCompaniesQuery()

  if (isLoading || !companiesDataWithPagMeta) {
    return <CompaniesTableSkeleton rows={10} />
  }
  const { items: companies, meta } = companiesDataWithPagMeta
  // const { companies, meta } = getCurrentPageCompanies()

  return (
    <>
      <DataTable
        columns={companyColumns(
          false,
          (+meta.currentPage - 1) * +meta.itemsPerPage,
          removeItemCallback,
          mutateExistingCompanyCallback
        )}
        data={companies}
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
