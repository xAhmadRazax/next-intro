"use client"
import { DataTable } from "../components/DataGridTable"
import { AddCompanyButton } from "./AddCompanyButton"
import { companyColumns } from "./company-columns"
import { CompanyTableFiltrationWrapper } from "./CompanyTableFiltrationWrapper"

interface CompaniesTableSkeletonProps {
  rows: number
  showFilter?: boolean
}

export const CompaniesTableSkeleton = ({
  rows = 1,
  showFilter = false,
}: CompaniesTableSkeletonProps) => {
  const skeletonData = Array.from({ length: rows }).map((_, index) => ({
    id: `skeleton-${index}`,
    name: "",
    email: "",
    address: "",
    logoPublicId: "",
    logo: null,
    createdAt: null,
    updatedAt: null,
  }))

  return (
    <>
      {showFilter && (
        <div className="mt-4 flex flex-col lg:px-2">
          <CompanyTableFiltrationWrapper disabled={true} />
          <AddCompanyButton />
        </div>
      )}

      <div className="flex-1 lg:px-2">
        <DataTable columns={companyColumns(true)} data={skeletonData} />
      </div>
    </>
  )
}
