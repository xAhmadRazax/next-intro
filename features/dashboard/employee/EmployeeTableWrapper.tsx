"use client"

// import { getEmployeeAttendance } from "@/lib/api"
import { AddEmployeeButton } from "./AddEmployeeButton"
import { EmployeesTable } from "./EmployeesTable"
import { EmployeeTableFiltrationWrapper } from "./EmployeeTableFiltrationWrapper"
import { useEmployeesQuery } from "./hooks/useEmployeesQuery"
import { EmployeeQueryType } from "@/types/dashboard.types"
import { PaginationMeta } from "@/types/pagination.types"

export const EmployeeTableWrapper = ({
  initialFetchedItems,
  initialFetchedMeta,
}: {
  initialFetchedItems: EmployeeQueryType[]
  initialFetchedMeta: PaginationMeta
}) => {
  const {
    addEmployeeToCache,
    deleteCachedEmployee,
    updateEmployeeInCache,
    isLoading,
    employees,
  } = useEmployeesQuery({
    initialFetchedItems: initialFetchedItems,
    initialFetchedMeta: initialFetchedMeta,
  })

  return (
    <>
      <div className="mt-4 flex flex-col lg:px-2">
        <EmployeeTableFiltrationWrapper />
        <AddEmployeeButton addEmployeeToCache={addEmployeeToCache} />
      </div>

      <div className="flex-1 lg:px-2">
        <EmployeesTable
          employees={employees}
          deleteCachedEmployee={deleteCachedEmployee}
          updateEmployeeInCache={updateEmployeeInCache}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}
