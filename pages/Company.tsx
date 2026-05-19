import { AddCompanyButton } from "@/features/dashboard/company/AddCompanyButton"
import { CompaniesTable } from "@/features/dashboard/company/CompaniesTable"
import { CompaniesTableSkeleton } from "@/features/dashboard/company/CompaniesTableSkeleton"
import { Suspense } from "react"

export const Company = ({ initialPage }: { initialPage: number }) => {
  return (
    <>
      <section className="mx-auto flex w-full max-w-[95%] min-w-0 flex-1 flex-col xl:max-w-350">
        <header className="py-4 text-center">
          <h1 className="text-lg font-bold text-primary md:text-2xl">
            Companies
          </h1>
        </header>
        <div className="mx-auto -mt-2 h-0.5 w-1/12 rounded-full bg-accent-foreground/30"></div>
        <AddCompanyButton />

        <div className="flex-1">
          <Suspense
            key={`company-${initialPage}`}
            fallback={<CompaniesTableSkeleton rows={10} />}
          >
            <CompaniesTable />
          </Suspense>
        </div>
      </section>
    </>
  )
}
