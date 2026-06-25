// import { getEmployees } from "@/lib/api"
import { EmployeeTableWrapper } from "@/features/dashboard/employee/EmployeeTableWrapper"
import { Suspense } from "react"
import { EmployeeQueryType } from "@/types/dashboard.types"
import { PaginationMeta } from "@/types/pagination.types"
import { BASEURL } from "@/constants/constants"
import { cookies } from "next/headers"
import { EmployeesTableSkeleton } from "@/features/dashboard/employee/EmployeesTableSkeleton"

export const Employee = async () => {
  const cookiesStore = await cookies()

  const res = await fetch(`${BASEURL}/dashboard/employees?page=1&limit=20`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookiesStore.toString(),
    },
  })
  if (!res.ok) {
    const data = await res.json()
  }

  const result = (await res.json()) as {
    data: EmployeeQueryType[]
    meta: PaginationMeta
  }

  // console.log(result)

  return (
    <>
      <section className="mx-auto flex w-full max-w-[95%] min-w-0 flex-1 flex-col xl:max-w-350">
        <header className="py-4 text-center">
          <h1 className="text-lg font-bold text-primary md:text-2xl">
            Employees
          </h1>
        </header>
        <div className="mx-auto -mt-2 h-0.5 w-1/12 rounded-full bg-accent-foreground/30"></div>

        <Suspense
          fallback={
            <EmployeesTableSkeleton rows={20} key={"employee-table-skeleton"} />
          }
        >
          <EmployeeTableWrapper
            initialFetchedItems={result.data}
            initialFetchedMeta={result.meta}
          />
        </Suspense>
      </section>
    </>
  )
}
