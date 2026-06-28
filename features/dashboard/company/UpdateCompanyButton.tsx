import { Button } from "@/components/ui/button"
import { UpdateCompanyForm } from "./UpdateCompanyForm"
import FormDialog from "../components/FormDialog"
import { Pencil } from "lucide-react"
import { CompanyType } from "@/types/dashboard.types"

interface UpdateCompanyButtonProps {
  company: CompanyType
  updateItemSuccessCallback?: (company: CompanyType) => void
}

export const UpdateCompanyButton = ({
  company,
  updateItemSuccessCallback,
}: UpdateCompanyButtonProps) => {
  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button variant="ghost" title="Update" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </FormDialog.Trigger>
      <FormDialog.Content className="sm:max-w-md">
        <UpdateCompanyForm
          company={company}
          companyId={company.id}
          updateItemSuccessCallback={updateItemSuccessCallback}
        />
      </FormDialog.Content>
    </FormDialog>
  )
}
