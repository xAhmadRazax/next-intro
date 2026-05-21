import { AddEmployeeButton } from "@/features/dashboard/employee/AddEmployeeButton"
import { EmployeesTable } from "@/features/dashboard/employee/EmployeesTable"
import { EmployeesTableSkeleton } from "@/features/dashboard/employee/EmployeesTableSkeleton"
import { EmployeeTableFiltrationWrapper } from "@/features/dashboard/employee/EmployeeTableFiltrationWrapper"
import { Suspense } from "react"

export const Employee = () => {
  return (
    <>
      <section className="mx-auto flex w-full max-w-[95%] min-w-0 flex-1 flex-col xl:max-w-350">
        <header className="py-4 text-center">
          <h1 className="text-lg font-bold text-primary md:text-2xl">
            Employees
          </h1>
        </header>
        <div className="mx-auto -mt-2 h-0.5 w-1/12 rounded-full bg-accent-foreground/30"></div>
        <div className="mt-4 flex flex-col lg:px-2">
          <EmployeeTableFiltrationWrapper />
          <AddEmployeeButton />
        </div>

        <div className="flex-1">
          <Suspense fallback={<EmployeesTableSkeleton rows={10} />}>
            <EmployeesTable />
          </Suspense>
        </div>
      </section>
    </>
  )
}
