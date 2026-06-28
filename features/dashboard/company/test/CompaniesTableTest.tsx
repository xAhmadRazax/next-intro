"use client"

import { CompanyType } from "@/db/schema"
import { PaginationMeta } from "@/types/pagination.types"
import { TablePaginationTest } from "@/components/TablePaginationTest"
import { CompaniesTableSkeleton } from "../CompaniesTableSkeleton"
import { companyColumns } from "../company-columns"
import { DataTable } from "../../components/DataGridTable"
import { DataTablePaginationWrapper } from "../../components/DataTablePaginationWrapper"

export const CompaniesTableTest = ({
  isLoading,
  companiesDataWithPagMeta,
  updatePage,
  removeItemCallback,
  mutateExistingCompanyCallback,
}: {
  updatePage: (page: number) => void
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

  const onChangePage = (page: number) => {
    // @ts-expect-error because im lazy and this is fking test
    setFilters((prev) => ({ ...prev, page }))
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
          <TablePaginationTest
            onPageChange={updatePage}
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
