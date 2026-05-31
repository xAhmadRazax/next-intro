"use client"
import { DataTable } from "../components/DataGridTable"
import { DataTablePaginationWrapper } from "../components/DataTablePaginationWrapper"
import { TablePagination } from "@/components/TablePagination"
import { employeeColumns } from "./employee-columns"
import { EmployeesTableSkeleton } from "./EmployeesTableSkeleton"
import { useEmployeesQuery } from "./hooks/useEmployeesQuery"
import { useSearchParams } from "next/navigation"

export const EmployeesTable = () => {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page"))
  const { employees: employeeDataWithPagMeta, isLoading } =
    useEmployeesQuery(page)

  if (isLoading || !employeeDataWithPagMeta) {
    return <EmployeesTableSkeleton rows={10} />
  }
  const { employees, meta } = employeeDataWithPagMeta

  return (
    <>
      {/* Filter Section - filters by name AND email */}
      {/* <DataTableFiltration /> */}
      {
        <DataTable
          columns={employeeColumns(
            false,
            (+meta.currentPage - 1) * +meta.itemsPerPage
          )}
          data={employees}
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
