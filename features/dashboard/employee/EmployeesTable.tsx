"use client"
import { DataTable } from "../components/DataGridTable"
import { DataTablePaginationWrapper } from "../components/DataTablePaginationWrapper"
import { TablePagination } from "@/components/TablePagination"
import { employeeColumns } from "./employee-columns"
import { EmployeesTableSkeleton } from "./EmployeesTableSkeleton"
import { PublicUserType } from "@/db/schema"
import { PaginationMeta } from "@/types/pagination.types"

export const EmployeesTable = ({
  isLoading,
  employees,
  updateEmployeeInCache,
  deleteCachedEmployee,
}: {
  isLoading: boolean
  employees: { items: PublicUserType[]; meta: PaginationMeta } | null
  updateEmployeeInCache: (updatedEmployee: PublicUserType) => void
  deleteCachedEmployee: (employeeId: string) => void
}) => {
  if (isLoading || !employees) {
    return <EmployeesTableSkeleton rows={10} />
  }
  const { items, meta } = employees

  return (
    <>
      {/* Filter Section - filters by name AND email */}
      {/* <DataTableFiltration /> */}
      {
        <DataTable
          columns={employeeColumns(
            false,
            (+meta.currentPage - 1) * +meta.itemsPerPage,
            updateEmployeeInCache,
            deleteCachedEmployee
          )}
          data={items}
        />
      }
      {meta && meta.totalPages > 1 && (
        <DataTablePaginationWrapper>
          <TablePagination
            totalPages={meta.totalPages}
            currentPage={meta.currentPage}
            isLoading={isLoading}
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
