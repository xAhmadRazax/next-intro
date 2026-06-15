"use client"
import { AddCompanyButton } from "./AddCompanyButton"
import { CompaniesTable } from "./CompaniesTable"
import { CompanyTableFiltrationWrapper } from "./CompanyTableFiltrationWrapper"
import { useCompaniesQuery } from "./hooks/useCompaniesQuery"
import { CompanyType } from "@/db/schema"
import { PaginationMeta } from "@/types/pagination.types"

export const CompanyTableWrapper = ({
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
  } = useCompaniesQuery({ initialFetchedItems, initialFetchedMeta })
  return (
    <>
      <div className="mt-4 flex flex-col lg:px-2">
        <CompanyTableFiltrationWrapper />
        <AddCompanyButton addCompanyCallbackHandler={addNewCompany} />
      </div>

      <div className="flex-1 lg:px-2">
        {/* <Suspense fallback={<CompaniesTableSkeleton rows={10} />}> */}
        <CompaniesTable
          isLoading={isLoading}
          companiesDataWithPagMeta={companies}
          removeItemCallback={removeItem}
          mutateExistingCompanyCallback={mutateExistingCompany}
        />
        {/* </Suspense> */}
      </div>
    </>
  )
}
