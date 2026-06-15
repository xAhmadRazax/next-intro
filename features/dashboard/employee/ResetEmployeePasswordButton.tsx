"use client"
import { Button } from "@/components/ui/button"
import { KeyRound } from "lucide-react"
import FormDialog from "../components/FormDialog"
import { ResetEmployeePasswordContent } from "./ResetEmployeePasswordContent"

interface ResetEmployeePasswordButtonProps {
  id: string
  name: string // Optional: show user name in confirmation
}

export const ResetEmployeePasswordButton = ({
  id,
  name,
}: ResetEmployeePasswordButtonProps) => {
  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button variant="ghost" size="icon" title="Reset password">
          <KeyRound className="h-4 w-4" />
        </Button>
      </FormDialog.Trigger>

      <FormDialog.Content className="sm:max-w-md">
        <ResetEmployeePasswordContent id={id} name={name} />
      </FormDialog.Content>
    </FormDialog>
  )
}
