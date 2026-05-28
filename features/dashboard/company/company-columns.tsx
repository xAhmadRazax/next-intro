"use client"

import { CompanyType } from "@/db/schemas/company.schema"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { TableCell } from "../components/TableCell"
import { Skeleton } from "@/components/ui/skeleton"
import { UpdateCompanyButton } from "./UpdateCompanyButton"
import { DeleteCompanyButton } from "./DeleteCompanyButton"

export const companyColumns = (
  isLoading?: boolean,
  itemSkip?: number
): ColumnDef<CompanyType>[] => [
  {
    id: "index",
    header: "#",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-10 max-w-20" />
      : ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex
          const pageSize = table.getState().pagination.pageSize

          return (
            <div className="w-10 max-w-20">
              {pageIndex * pageSize + row.index + 1 + (itemSkip || 0)}
            </div>
          )
        },
  },

  {
    accessorKey: "logo",
    header: "Logo",
    cell: isLoading
      ? () => <Skeleton className="h-15 w-15 rounded-full" />
      : ({ row }) => {
          const logo = row.getValue("logo") as string

          if (!logo) {
            return <div className="w-15">N/A</div>
          }

          return (
            <Image
              src={logo}
              alt="Company Logo"
              width={60}
              height={60}
              className="h-15 min-w-15 rounded-full object-cover"
            />
          )
        },
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-75 min-w-38" />
      : ({ row }) => (
          <TableCell className="w-full max-w-75 min-w-38 break-all whitespace-normal">
            {row.getValue("name")}
          </TableCell>
        ),
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-90 min-w-63" />
      : ({ row }) => (
          <TableCell className="w-full max-w-90 min-w-63 break-all whitespace-normal">
            {row.getValue("email")}
          </TableCell>
        ),
  },

  {
    accessorKey: "address",
    header: "Address",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-100 min-w-72" />
      : ({ row }) => (
          <TableCell className="w-full max-w-100 break-all whitespace-normal">
            {row.getValue("address")}
          </TableCell>
        ),
  },

  {
    header: "Actions",
    cell: isLoading
      ? () => (
          <div className="flex w-36 space-x-2">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-14" />
          </div>
        )
      : ({ row }) => (
          <TableCell className="w-36 break-all whitespace-normal">
            <div className="flex justify-end gap-2">
              <UpdateCompanyButton
                company={{
                  id: row.original.id,
                  name: row.original.name,
                  email: row.original.email,
                  address: row.original.address,
                  logo: row.original.logo ?? undefined,
                }}
              />
              <DeleteCompanyButton
                id={row.original.id}
                name={row.original.name}
              />
            </div>
          </TableCell>
        ),
  },
]
