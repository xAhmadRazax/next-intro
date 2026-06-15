"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { TableCell } from "../components/TableCell"
import { Skeleton } from "@/components/ui/skeleton"
import { UpdateEmployeeButton } from "./UpdateEmployeeButton"
import { DeleteEmployeeButton } from "./DeleteEmployeeButton"
import { ResetEmployeePasswordButton } from "./ResetEmployeePasswordButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PublicUserType } from "@/db/schema"
import { EmployeeQueryType } from "@/types/dashboard.types"
import { ViewEmployeeAttendanceButton } from "./ViewEmployeeAttendanceButton"

export const employeeColumns = (
  isLoading?: boolean,
  itemSkip?: number,
  updateEmployeeInCache?: (updatedEmployee: PublicUserType) => void,
  deleteCachedEmployee?: (employeeId: string) => void
): ColumnDef<EmployeeQueryType>[] => [
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
    accessorKey: "avatar",
    header: "Avatar",
    cell: isLoading
      ? () => <Skeleton className="h-10 w-10 rounded-full" />
      : ({ row }) => {
          const avatar = row.getValue("avatar") as string
          const name = row.original.username

          return (
            <Avatar>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )
        },
  },

  {
    accessorKey: "username",
    header: "Name",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-75 min-w-50" />
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
      ? () => <Skeleton className="h-8 max-w-90 min-w-63" />
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
      ? () => <Skeleton className="h-8 w-full max-w-100 min-w-50" />
      : ({ row }) => (
          <TableCell className="w-full max-w-100 break-all whitespace-normal">
            {row.getValue("company.name")}
          </TableCell>
        ),
  },

  {
    id: "stats.totalHours",
    header: "Hours logged",
    accessorFn: (row) => row.stats?.totalHours,
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full min-w-30" />
      : ({ row }) => (
          <TableCell className="w-full max-w-30 break-all whitespace-normal">
            {row.getValue("stats.totalHours")}
          </TableCell>
        ),
  },

  {
    id: "stats.lastActivity",
    header: "Last Activity",
    accessorFn: (row) => row.stats?.lastActivity,
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full min-w-30" />
      : ({ row }) => (
          <TableCell className="w-full max-w-30 break-all whitespace-normal">
            {row.getValue("stats.lastActivity")}
          </TableCell>
        ),
  },

  {
    id: "actions", // ← Add this! Required when not using accessorKey
    header: () => <div className="text-center">Actions</div>,
    cell: isLoading
      ? () => (
          <div className="flex w-auto justify-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        )
      : ({ row }) => (
          <TableCell className="w-auto break-all whitespace-normal">
            <div className="flex justify-end gap-2">
              <ViewEmployeeAttendanceButton
                employeeId={row.original.id}
                employee={row.original}
              />
              <UpdateEmployeeButton
                updateEmployeeInCache={updateEmployeeInCache}
                employee={{
                  ...row.original,
                  id: row.original.id,
                  username: row.original.username,
                  email: row.original.email,
                  avatar: row.original.avatar,
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
