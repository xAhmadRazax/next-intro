import { useIsFetching, useQueryClient } from "@tanstack/react-query"
import DataTable from "../components/DataTable"
import { useUsers } from "./hooks/useUsers"
import { usePrefetchUsers } from "./hooks/usePrefetchUsers"
import { EmployeesTableBody } from "./EmployeesTableBody"
import { TablePagination } from "@/components/TablePagination"
import { DataTablePaginationWrapper } from "../components/DataTablePaginationWrapper"
import { EmployeesTableHeader } from "./EmployeesTableHeader"

export const EmployeesTable = () => {
  const queryClient = useQueryClient()
  const { data, meta, page, isLoading } = useUsers()
  const employees = data?.data || []

  const isFetching = useIsFetching({
    queryKey: ["users"],
  })

  usePrefetchUsers(meta.currentPage, meta?.pages || 1)

  const isPrefetchingNextPage = useIsFetching({
    queryKey: [
      "users",
      meta.currentPage + 1 < meta.pages ? meta.currentPage + 1 : meta.pages,
    ],
  })
  const isPrefetchingPrevPage = useIsFetching({
    queryKey: ["users", meta.currentPage - 1 > 1 ? meta.currentPage - 1 : 1],
  })

  return (
    <>
      <DataTable
        isFetching={!!isFetching}
        isLoading={isLoading}
        onRefresh={() =>
          queryClient.invalidateQueries({
            queryKey: ["users", page || 1],
          })
        }
      >
        <EmployeesTableHeader />

        <DataTable.Body>
          <EmployeesTableBody
            employees={employees}
            itemsPerPage={meta?.itemsPerPage || 10}
            currentPage={meta.currentPage || 1}
          />
        </DataTable.Body>
      </DataTable>

      {/* pagination */}
      {meta && meta.pages > 1 && (
        <DataTablePaginationWrapper>
          <TablePagination
            currentPage={meta.currentPage}
            currentItems={
              (meta.currentPage - 1) * meta.itemsPerPage + employees.length
            }
            items={meta.items}
            isLoading={isLoading}
            resourceName="users"
            isFetchingNextPage={!!isPrefetchingNextPage}
            isFetchingPrevPage={!!isPrefetchingPrevPage}
            totalPages={meta.pages}
          />
        </DataTablePaginationWrapper>
      )}
    </>
  )
}
