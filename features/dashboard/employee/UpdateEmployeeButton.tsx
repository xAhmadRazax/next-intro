import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { useQueryClient } from "@tanstack/react-query"
// import { getUser } from "@/lib/api"
import type { EmployeeType } from "@/types/dashboard.types"
import { UpdateEmployeeForm } from "./UpdateEmployeeForm"

interface UpdateEmployeeButtonProps {
  employee: EmployeeType
}

export const UpdateEmployeeButton = ({
  employee,
}: UpdateEmployeeButtonProps) => {
  // const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)

  const onSuccess = () => {
    console.log("User updated successfully")
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <DialogTrigger
          render={
            <Button
              // onMouseEnter={prefetchUserData}
              // onFocus={prefetchUserData} // ← Add for keyboard
              // onTouchStart={prefetchUserData} // ← Add for mobile
              variant="secondary"
              className="bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
              size="sm"
            />
          }
        >
          Update
        </DialogTrigger>
      </div>
      <DialogContent className="px-6 text-foreground/80">
        <UpdateEmployeeForm
          employee={employee}
          employeeId={employee.id}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
