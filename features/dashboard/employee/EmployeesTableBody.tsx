import { TableBody, TableCell, TableRow } from "@/components/ui/table"

import { EmployeeTableRow } from "./EmployeeTableRow"
import type { UserType } from "@/types/dashboard.types"

interface EmployeesTableProps {
  employees: UserType[]
  currentPage: number
  itemsPerPage: number
}

export const EmployeesTableBody = ({
  employees,
  currentPage = 1,
  itemsPerPage,
}: EmployeesTableProps) => {
  return (
    <TableBody>
      {employees.length > 0 ? (
        employees.map((row, index: number) => (
          <EmployeeTableRow
            key={row.id}
            {...row}
            index={(currentPage - 1) * itemsPerPage + index + 1}
          />
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6} className="h-32 text-center">
            <div className="text-muted-foreground">No employees found</div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
