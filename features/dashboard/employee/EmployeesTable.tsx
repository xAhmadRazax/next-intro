"use client"
import { useQueryClient } from "@tanstack/react-query"
import { DataTable } from "../components/DataGridTable"
import { DataTablePaginationWrapper } from "../components/DataTablePaginationWrapper"
import { TablePagination } from "@/components/TablePagination"
import { useEmployees } from "./hooks/useEmployees"
import { employeeColumns } from "./employee-columns"
import { usePrefetchEmployees } from "./hooks/usePrefetchEmployees"
import { EmployeesTableSkeleton } from "./EmployeesTableSkeleton"
import { employeeKeys } from "@/lib/queryKeys"
import { getEmployees } from "@/lib/api"
// import { usePrefetchCompany } from "./hooks/usePrefetchCompany"

export const EmployeesTable = () => {
  const queryClient = useQueryClient()
  const { data, meta, isLoading, isRefetching } = useEmployees()
  const employees = data?.data || []

  usePrefetchEmployees(meta?.currentPage, meta?.totalPages || 1)

  const prefetchNextPage = () =>
    queryClient.prefetchQuery({
      queryKey: employeeKeys.list(meta.currentPage + 1),
      queryFn: () => getEmployees({ page: meta.currentPage + 1 }),
    })

  const prefetchPrevPage = () =>
    queryClient.prefetchQuery({
      queryKey: employeeKeys.list(meta.currentPage - 1),
      queryFn: () => getEmployees({ page: meta.currentPage - 1 }),
    })

  if (isLoading || isRefetching) {
    return <EmployeesTableSkeleton rows={10} />
  }

  return (
    <>
      {/* Filter Section - filters by name AND email */}
      {/* <DataTableFiltration /> */}
      <DataTable
        columns={employeeColumns(
          false,
          (+meta.currentPage - 1) * +meta.itemsPerPage
        )}
        data={employees}
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
