import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { useQueryClient } from "@tanstack/react-query"
// import { getUser } from "@/lib/api"
import type { UserType } from "@/types/dashboard.types"
import { UpdateEmployeeForm } from "./UpdateEmployeeForm"

interface UpdateUserButtonProps {
  user: UserType
}

export const UpdateEmployeeButton = ({ user }: UpdateUserButtonProps) => {
  // const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)

  // const prefetchUserData = () => {
  //   queryClient.prefetchQuery({
  //     queryKey: ["users", user.id],
  //     queryFn: () => getUser(user.id),
  //   })
  // }

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
          user={user}
          userId={user.id}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
