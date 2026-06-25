// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { TableCell } from "../components/TableCell"
// import { Skeleton } from "@/components/ui/skeleton"
// import { ProjectType } from "@/db/schema"

// export const projectColumns = (
//   isLoading?: boolean,
//   itemSkip?: number
// ): ColumnDef<ProjectType>[] => [
//   {
//     id: "index",
//     header: "#",
//     cell: isLoading
//       ? () => <Skeleton className="h-8 w-10 max-w-20" />
//       : ({ row, table }) => {
//           const pageIndex = table.getState().pagination.pageIndex
//           const pageSize = table.getState().pagination.pageSize

//           return (
//             <div className="min-w-10">
//               {pageIndex * pageSize + row.index + 1 + (itemSkip || 0)}
//             </div>
//           )
//         },
//   },

//   {
//     accessorKey: "name",
//     header: "Project Name",
//     cell: isLoading
//       ? () => <Skeleton className="h-8 w-full max-w-75 min-w-30" />
//       : ({ row }) => (
//           <TableCell className="w-full max-w-75 min-w-38 break-all whitespace-normal">
//             {row.getValue("name")}
//           </TableCell>
//         ),
//   },

//   {
//     accessorKey: "projectManager",
//     header: "Project Manager",
//     cell: isLoading
//       ? () => <Skeleton className="h-8 max-w-90 min-w-63" />
//       : ({ row }) => (
//           <TableCell className="w-full max-w-60 min-w-63 break-all whitespace-normal">
//             {row.getValue("projectManager") ?? "___"}
//           </TableCell>
//         ),
//   },

//   {
//     id: "endDate",
//     header: "Dead lines",
//     cell: isLoading
//       ? () => <Skeleton className="h-8 w-full max-w-100 min-w-30" />
//       : ({ row }) => (
//           <TableCell className="w-full max-w-100 min-w-30 break-all whitespace-normal">
//             {row.getValue("endDate")}
//           </TableCell>
//         ),
//   },

//   {
//     id: "status",
//     header: "Status",
//     cell: isLoading
//       ? () => <Skeleton className="h-8 w-full max-w-100 min-w-30" />
//       : ({ row }) => (
//           <TableCell className="w-full max-w-100 min-w-30 break-all whitespace-normal">
//             {row.getValue("status")}
//           </TableCell>
//         ),
//   },
// ]
