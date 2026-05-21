"use client"
import { DataTable } from "../components/DataGridTable"
import { employeeColumns } from "./employee-columns"

interface EmployeesTableSkeletonProps {
  rows: number
}

export const EmployeesTableSkeleton = ({
  rows = 1,
}: EmployeesTableSkeletonProps) => {
  const skeletonData = Array.from({ length: rows }).map((_, index) => ({
    id: `skeleton-${index}`,
    username: "",
    email: "",
    company: {
      id: `skeleton-company-${index}`,
      name: "",
      email: "",
      address: "",
      logo: undefined,
      createdAt: null,
      updatedAt: null,
    },
    avatar: undefined,
    createdAt: null,
    updatedAt: null,
  }))

  return <DataTable columns={employeeColumns(true)} data={skeletonData} />
}
