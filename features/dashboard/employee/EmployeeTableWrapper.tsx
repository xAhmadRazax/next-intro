"use client"

import { AddEmployeeButton } from "./AddEmployeeButton"
import { EmployeesTable } from "./EmployeesTable"
import { EmployeeTableFiltrationWrapper } from "./EmployeeTableFiltrationWrapper"
import { useEmployeesQuery } from "./hooks/useEmployeesQuery"

export const EmployeeTableWrapper = () => {
  const {
    addEmployeeToCache,
    deleteCachedEmployee,
    updateEmployeeInCache,
    isLoading,
    employees,
  } = useEmployeesQuery()
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
