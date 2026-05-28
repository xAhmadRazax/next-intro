import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { useQueryClient } from "@tanstack/react-query"
// import { getUser } from "@/lib/api"
import type { UserType } from "@/types/dashboard.types"
import { UpdateEmployeeForm } from "./UpdateEmployeeForm"
import { Pencil } from "lucide-react"

interface UpdateEmployeeButtonProps {
  employee: UserType
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
              variant="ghost"
              title="Update"
              size="icon"
            />
          }
        >
          <Pencil className="h-4 w-4" />
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
