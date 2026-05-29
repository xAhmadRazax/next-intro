"use client"
import { DataTable } from "../components/DataGridTable"
import { companyColumns } from "./company-columns"

interface CompaniesTableSkeletonProps {
  rows: number
}

export const CompaniesTableSkeleton = ({
  rows = 1,
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

  return <DataTable columns={companyColumns(true)} data={skeletonData} />
}
