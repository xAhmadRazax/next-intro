"use client"
import { CompanyType } from "@/db/schema"
import { AddCompanyButton } from "../AddCompanyButton"
import { PaginationMeta } from "@/types/pagination.types"
import { Suspense } from "react"
import { CompaniesTableSkeleton } from "../CompaniesTableSkeleton"
import { useCompaniesTestQuery } from "./hooks/useCompaniesTestQuery"
import { CompaniesTableTest } from "./CompaniesTableTest"
import { CompanyTableFiltrationWrapperTest } from "./CompanyTableFiltrationWrappersText"

export const CompanyTableTestWrapper = ({
  initialFetchedItems,
  initialFetchedMeta,
}: {
  initialFetchedItems: CompanyType[]
  initialFetchedMeta: PaginationMeta
}) => {
  const {
    companies,
    isLoading,
    addNewCompany,
    removeItem,
    mutateExistingCompany,
    updatePage,
    updateFilters,
    filters,
  } = useCompaniesTestQuery({ initialFetchedItems, initialFetchedMeta })
  return (
    <>
      <div className="mt-4 flex flex-col lg:px-2">
        <CompanyTableFiltrationWrapperTest
          updateFilters={updateFilters}
          filters={filters}
        />
        <AddCompanyButton addCompanyCallbackHandler={addNewCompany} />
      </div>

      <div className="flex-1 lg:px-2">
        <Suspense fallback={<CompaniesTableSkeleton rows={10} />}>
          <CompaniesTableTest
            isLoading={isLoading}
            companiesDataWithPagMeta={companies}
            removeItemCallback={removeItem}
            mutateExistingCompanyCallback={mutateExistingCompany}
            updatePage={updatePage}
          />
        </Suspense>
      </div>
    </>
  )
}
