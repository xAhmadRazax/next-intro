import { Button } from "@/components/ui/button"
import type { CompanyType } from "@/types/dashboard.types"
import { UpdateCompanyForm } from "./UpdateCompanyForm"
import FormDialog from "../components/FormDialog"
import { Pencil } from "lucide-react"

interface UpdateCompanyButtonProps {
  company: CompanyType
}

export const UpdateCompanyButton = ({ company }: UpdateCompanyButtonProps) => {
  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button variant="ghost" title="Update" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </FormDialog.Trigger>
      <FormDialog.Content>
        <UpdateCompanyForm company={company} companyId={company.id} />
      </FormDialog.Content>
    </FormDialog>
  )
}
