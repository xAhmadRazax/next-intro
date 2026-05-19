"use client"
import { useState } from "react"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { FormDialogContext } from "../hooks/useFormDialog"

type TriggerProps = {
  children: React.ReactElement
}

function Root({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false)

  const onSuccess = () => {
    setOpen(false)
  }

  return (
    <FormDialogContext.Provider
      value={{
        open,
        setOpen,
        onSuccess,
      }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </FormDialogContext.Provider>
  )
}

function Trigger({ children }: TriggerProps) {
  return (
    <div className="flex justify-end">
      <DialogTrigger render={children} />
    </div>
  )
}

function Content({ children }: React.PropsWithChildren) {
  return (
    <DialogContent className="px-6 text-foreground/80">
      {children}
    </DialogContent>
  )
}

const FormDialog = Object.assign(Root, {
  Trigger,
  Content,
})

export default FormDialog
