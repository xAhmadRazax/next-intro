import { TableCell, TableRow } from "@/components/ui/table"
import { DeleteUserButton } from "./DeleteEmployeeButton"
import { UpdateEmployeeButton } from "./UpdateEmployeeButton"

interface EmployeeTableRowProps {
  index: number
  id: string
  name: string
  email: string
  age: number
  isVerified: boolean
  lastLoginAt: string
  companyId: string
  companyName: string
}

export const EmployeeTableRow = ({
  index,
  id,
  name,
  email,
  age,
  isVerified,
  lastLoginAt,
  companyId,
  companyName,
}: EmployeeTableRowProps) => {
  return (
    <TableRow className="transition-colors hover:bg-muted/40">
      <TableCell className="ps-4 font-medium">{index}</TableCell>
      <TableCell className="font-medium">{email}</TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>{companyName}</TableCell>

      <TableCell>{age}</TableCell>

      <TableCell className="text-muted-foreground">
        {new Date(lastLoginAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>

      <TableCell colSpan={2} className="pe-4">
        <div className="flex justify-end gap-2">
          <UpdateEmployeeButton
            user={{
              id,
              name,
              email,
              age,
              companyName,
              companyId,
              isVerified,
              lastLoginAt,
            }}
          />
          <DeleteUserButton id={id} name={name} />
        </div>
      </TableCell>
    </TableRow>
  )
}
