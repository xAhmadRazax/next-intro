"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { TableCell } from "../components/TableCell"
import { Skeleton } from "@/components/ui/skeleton"
import { UpdateCompanyButton } from "./UpdateCompanyButton"
import { DeleteCompanyButton } from "./DeleteCompanyButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CompanyType } from "@/db/schema"

export const companyColumns = (
  isLoading?: boolean,
  itemSkip?: number,
  removeItemCallback?: (id: string) => void,
  mutateExistingCompanyCallback?: (company: CompanyType) => void
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
            <div className="min-w-10">
              {pageIndex * pageSize + row.index + 1 + (itemSkip || 0)}
            </div>
          )
        },
  },

  {
    accessorKey: "logo",
    header: "Logo",
    cell: isLoading
      ? () => <Skeleton className="h-10 w-10 rounded-full" />
      : ({ row }) => {
          const logo = row.getValue("logo") as string
          const name = row.original.name

          return (
            <Avatar>
              <AvatarImage src={logo} alt={name} />
              <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )
        },
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-75 min-w-50" />
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
      ? () => <Skeleton className="h-8 max-w-90 min-w-75" />
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
      ? () => <Skeleton className="h-8 max-w-100 min-w-80" />
      : ({ row }) => {
          return (
            <TableCell className="w-full max-w-100 min-w-72 break-all whitespace-normal">
              {row.original.company.address ?? "___"}
            </TableCell>
          )
        },
  },

  {
    id: "actions", // ← Add this! Required when not using accessorKey
    header: () => <div className="text-center">Actions</div>,
    cell: isLoading
      ? () => (
          <div className="flex w-25 justify-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        )
      : ({ row }) => (
          <TableCell className="w-36 break-all whitespace-normal">
            <div className="flex justify-center gap-2">
              <UpdateCompanyButton
                updateItemSuccessCallback={mutateExistingCompanyCallback}
                company={{
                  ...row.original,
                  id: row.original.id,
                  name: row.original.name,
                  email: row.original.email,
                  // address: row.original.address,
                  // logo: row.original.logo,
                }}
              />
              <DeleteCompanyButton
                id={row.original.id}
                name={row.original.name}
                deleteItemCallback={removeItemCallback}
              />
            </div>
          </TableCell>
        ),
  },
]
