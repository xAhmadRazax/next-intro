"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { TableCell } from "../components/TableCell"
import { Skeleton } from "@/components/ui/skeleton"
import { UserType } from "@/types/dashboard.types"
import { UpdateEmployeeButton } from "./UpdateEmployeeButton"
import { DeleteEmployeeButton } from "./DeleteEmployeeButton"
import { ResetEmployeePasswordButton } from "./ResetEmployeePasswordButton"

export const employeeColumns = (
  isLoading?: boolean,
  itemSkip?: number
): ColumnDef<UserType>[] => [
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
    accessorKey: "avatar",
    header: "Avatar",
    cell: isLoading
      ? () => <Skeleton className="h-15 w-15 rounded-full" />
      : ({ row }) => {
          const avatar = row.getValue("avatar") as string

          if (!avatar) {
            return <div className="w-15">N/A</div>
          }

          return (
            <Image
              src={avatar}
              alt="Employee Avatar"
              width={60}
              height={60}
              className="h-15 min-w-15 rounded-full object-cover"
            />
          )
        },
  },

  {
    accessorKey: "username",
    header: "Name",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-75 min-w-38" />
      : ({ row }) => (
          <TableCell className="w-full max-w-75 min-w-38 break-all whitespace-normal">
            {row.getValue("username")}
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
    id: "company.name",
    header: "Company",
    accessorFn: (row) => row.company?.name,
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-100 min-w-72" />
      : ({ row }) => (
          <TableCell className="w-full max-w-100 break-all whitespace-normal">
            {row.getValue("company.name")}
          </TableCell>
        ),
  },

  {
    header: "Actions",
    cell: isLoading
      ? () => (
          <div className="flex w-36 space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        )
      : ({ row }) => (
          <TableCell className="w-36 break-all whitespace-normal">
            <div className="flex justify-end gap-2">
              <UpdateEmployeeButton
                employee={{
                  id: row.original.id,
                  username: row.original.username,
                  email: row.original.email,
                  avatar: row.original.avatar ?? undefined,
                  company: row.original.company,
                  role: row.original.role,
                }}
              />
              <DeleteEmployeeButton
                id={row.original.id}
                name={row.original.username}
              />
              <ResetEmployeePasswordButton
                id={row.original.id}
                name={row.original.username}
              />
            </div>
          </TableCell>
        ),
  },
]
