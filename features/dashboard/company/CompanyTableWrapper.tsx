"use client"
import { Suspense } from "react"
import { AddCompanyButton } from "./AddCompanyButton"
import { CompaniesTable } from "./CompaniesTable"
import { CompanyTableFiltrationWrapper } from "./CompanyTableFiltrationWrapper"
import { useCompaniesQuery } from "./hooks/useCompaniesQuery"

export const CompanyTableWrapper = () => {
  const {
    companies,
    isLoading,
    addNewCompany,
    removeItem,
    mutateExistingCompany,
  } = useCompaniesQuery()
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
