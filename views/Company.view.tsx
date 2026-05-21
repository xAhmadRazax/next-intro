import { AddCompanyButton } from "@/features/dashboard/company/AddCompanyButton"
import { CompaniesTable } from "@/features/dashboard/company/CompaniesTable"
import { CompaniesTableSkeleton } from "@/features/dashboard/company/CompaniesTableSkeleton"
import { CompanyTableFiltrationWrapper } from "@/features/dashboard/company/CompanyTableFiltrationWrapper"
import { Suspense } from "react"

export const Company = () => {
  return (
    <>
      <section className="mx-auto flex w-full max-w-[95%] min-w-0 flex-1 flex-col xl:max-w-350">
        <header className="py-4 text-center">
          <h1 className="text-lg font-bold text-primary md:text-2xl">
            Companies
          </h1>
        </header>
        <div className="mx-auto -mt-2 h-0.5 w-1/12 rounded-full bg-accent-foreground/30"></div>

        <div className="mt-4 flex flex-col lg:px-2">
          <CompanyTableFiltrationWrapper />
          <AddCompanyButton />
        </div>

        <div className="flex-1 lg:px-2">
          <Suspense fallback={<CompaniesTableSkeleton rows={10} />}>
            <CompaniesTable />
          </Suspense>
        </div>
      </section>
    </>
  )
}
