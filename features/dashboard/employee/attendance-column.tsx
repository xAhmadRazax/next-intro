import { Skeleton } from "@/components/ui/skeleton"
import { AttendanceType } from "@/db/schema"
import { EmployeeAttendance } from "@/types/dashboard.types"
import { ColumnDef } from "@tanstack/react-table"
import { TableCell } from "../components/TableCell"

export const attendanceColumns = (
  isLoading?: boolean,
  itemSkip?: number,
  removeItemCallback?: (id: string) => void,
  mutateExistingCompanyCallback?: (attendance: AttendanceType) => void
): ColumnDef<EmployeeAttendance>[] => [
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
    accessorKey: "day",
    header: "Day",
    cell: isLoading
      ? () => <Skeleton className="h-10 w-10 rounded-full" />
      : ({ row }) => {
          //   const logo = row.getValue("logo") as string
          //   const name = row.original.name

          return (
            <TableCell className="w-full min-w-20 break-all whitespace-normal">
              {row.getValue("day")}
            </TableCell>
          )
        },
  },

  {
    accessorKey: "date",
    header: "Date",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-35 min-w-35" />
      : ({ row }) => (
          <TableCell className="w-full min-w-25 break-all whitespace-normal">
            {row.getValue("date")}
          </TableCell>
        ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: isLoading
      ? () => <Skeleton className="h-8 w-full max-w-35 min-w-35" />
      : ({ row }) => (
          <TableCell className="w-full min-w-18 break-all whitespace-normal">
            {row.getValue("status")}
          </TableCell>
        ),
  },

  {
    accessorKey: "checkIn",
    header: "Clocked In",
    cell: isLoading
      ? () => <Skeleton className="h-8 max-w-90 min-w-75" />
      : ({ row }) => (
          <TableCell className="w-full min-w-18 break-all whitespace-normal">
            {row.getValue("checkIn")}
          </TableCell>
        ),
  },

  {
    accessorKey: "checkOut",
    header: "Clocked Out",
    cell: isLoading
      ? () => <Skeleton className="h-8 max-w-90 min-w-75" />
      : ({ row }) => (
          <TableCell className="w-full min-w-18 break-all whitespace-normal">
            {row.getValue("checkOut")}
          </TableCell>
        ),
  },

  {
    accessorKey: "duration",
    cell: isLoading
      ? () => <Skeleton className="h-8 max-w-90 min-w-75" />
      : ({ row }) => (
          <TableCell className="w-full min-w-18 break-all whitespace-normal">
            {row.getValue("duration")}
          </TableCell>
        ),
  },
]
