import { BASEURL } from "@/constants/constants"
import { CompanyType } from "@/db/schema"
// import { CompanyType } from "@/db/schema"
import { CompaniesTableSkeleton } from "@/features/dashboard/company/CompaniesTableSkeleton"
import { CompanyTableTestWrapper } from "@/features/dashboard/company/test/companyTableWrapperTest"
import { PaginationMeta } from "@/types/pagination.types"
// import { PaginationMeta } from "@/types/pagination.types"
import { cookies } from "next/headers"
import { Suspense } from "react"

export const CompanyWithStatePagination = async () => {
  const cookiesStore = await cookies()
  // const data = await getCompanies({}, cookiesStore.toString())
  // console.log(data)

  const res = await fetch(`${BASEURL}/dashboard/companies?page=1&limit=20`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookiesStore.toString(),
    },
  })
  if (!res.ok) {
    const data = await res.json()
  }
  const companiesData = (await res.json()) as {
    data: CompanyType[]
    meta: PaginationMeta
  }

  console.log(companiesData, "companies")

  return (
    <>
      <section className="mx-auto flex w-full max-w-[95%] min-w-0 flex-1 flex-col xl:max-w-350">
        <header className="py-4 text-center">
          <h1 className="text-lg font-bold text-primary md:text-2xl">
            Companies
          </h1>
        </header>
        <div className="mx-auto -mt-2 h-0.5 w-1/12 rounded-full bg-accent-foreground/30"></div>

        <Suspense
          fallback={<CompaniesTableSkeleton rows={20} showFilter={true} />}
        >
          <CompanyTableTestWrapper
            initialFetchedItems={companiesData.data}
            initialFetchedMeta={companiesData.meta}
          />
        </Suspense>
      </section>
    </>
  )
}
