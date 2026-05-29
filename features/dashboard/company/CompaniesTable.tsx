"use client"
// import { TablePagination } from "@/components/TablePagination"
import { useIsFetching, useQueryClient } from "@tanstack/react-query"
import { useCompanies } from "./reactQueryHooks/useCompanies"
import { DataTable } from "../components/DataGridTable"
import { companyColumns } from "./company-columns"
import { DataTablePaginationWrapper } from "../components/DataTablePaginationWrapper"
import { TablePagination } from "@/components/TablePagination"
import { usePrefetchCompany } from "./reactQueryHooks/usePrefetchCompany"
import { companyKeys } from "@/lib/queryKeys"
import { getCompanies } from "@/lib/api"
import { CompaniesTableSkeleton } from "./CompaniesTableSkeleton"
// import { usePrefetchCompany } from "./hooks/usePrefetchCompany"

export const CompaniesTable = () => {
  const queryClient = useQueryClient()
  const { data, meta, isLoading, isRefetching } = useCompanies()
  const companies = data?.data || []

  // const isFetching = useIsFetching({
  //   queryKey: ["companies"],
  // })

  usePrefetchCompany(meta.currentPage, meta?.totalPages || 1)

  // const isPrefetchingNextPage = useIsFetching({
  //   queryKey: [
  //     "companies",
  //     meta.currentPage + 1 < meta.pages ? meta.currentPage + 1 : meta.pages,
  //   ],
  // })
  // const isPrefetchingPrevPage = useIsFetching({
  //   queryKey: [
  //     "companies",
  //     meta.currentPage - 1 > 1 ? meta.currentPage - 1 : 1,
  //   ],
  // })

  const prefetchNextPage = () =>
    queryClient.prefetchQuery({
      queryKey: companyKeys.page(meta.currentPage + 1),
      queryFn: () => getCompanies({ page: meta.currentPage + 1 }),
    })

  const prefetchPrevPage = () =>
    queryClient.prefetchQuery({
      queryKey: companyKeys.page(meta.currentPage - 1),
      queryFn: () => getCompanies({ page: meta.currentPage - 1 }),
    })

  if (isLoading || isRefetching) {
    return <CompaniesTableSkeleton rows={10} />
  }

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
          {/* <TablePagination
            currentPage={meta.currentPage}
            currentItems={
              (meta.currentPage - 1) * meta.itemsPerPage + companies.length
            }
            items={meta.itemsPerPage}
            isLoading={isLoading}
            resourceName="companies"
            // isFetchingNextPage={!!isPrefetchingNextPage}
            // isFetchingPrevPage={!!isPrefetchingPrevPage}
            totalPages={meta.totalPages}
          /> */}

          <TablePagination
            totalPages={meta.totalPages}
            currentPage={meta.currentPage}
            isLoading={isLoading}
            prefetchNextHandler={prefetchNextPage}
            prefetchPrevHandler={prefetchPrevPage}
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
