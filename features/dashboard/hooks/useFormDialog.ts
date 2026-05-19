"use client"
import { createContext, useContext } from "react"

export type FormDialogContextType = {
  onSuccess: () => void
  open: boolean
  setOpen: (v: boolean) => void
}

export const FormDialogContext = createContext<FormDialogContextType | null>(
  null
)

export function useFormDialog() {
  const context = useContext(FormDialogContext)

  if (!context) {
    throw new Error("Must be used inside FormDialog")
  }

  return context
}
