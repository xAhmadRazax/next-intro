"use client"
import { roleEnum } from "@/db/schema"
import { DataTable } from "../components/DataGridTable"
import { employeeColumns } from "./employee-columns"
import { EmployeeTableFiltrationWrapper } from "./EmployeeTableFiltrationWrapper"
import { AddEmployeeButton } from "./AddEmployeeButton"

interface EmployeesTableSkeletonProps {
  rows: number
  showFilter?: boolean
}

export const EmployeesTableSkeleton = ({
  rows = 1,
  showFilter = false,
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
      logo: null,
      createdAt: null,
      updatedAt: null,
      logoPublicId: "",
    },
    companyId: `skeleton-company-${index}`,
    avatar: null,
    createdAt: null,
    updatedAt: null,
    role: "employee" as const,
    avatarPublicId: "",
  }))

  return (
    <>
      {showFilter && (
        <div className="mt-4 flex flex-col lg:px-2">
          <EmployeeTableFiltrationWrapper disabled={true} />
          <AddEmployeeButton />
        </div>
      )}

      <div className="flex-1 lg:px-2">
        <DataTable columns={employeeColumns(true)} data={skeletonData} />
      </div>
    </>
  )
}
