import { EmployeeTableWrapper } from "@/features/dashboard/employee/EmployeeTableWrapper"

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

        <EmployeeTableWrapper />
      </section>
    </>
  )
}
