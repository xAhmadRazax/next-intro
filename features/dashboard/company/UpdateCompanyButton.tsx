import { Button } from "@/components/ui/button"
import type { CompanyType } from "@/types/dashboard.types"
import { UpdateCompanyForm } from "./UpdateCompanyForm"
import FormDialog from "../components/FormDialog"

interface UpdateCompanyButtonProps {
  company: CompanyType
}

export const UpdateCompanyButton = ({ company }: UpdateCompanyButtonProps) => {
  // const queryClient = useQueryClient()

  // const prefetchUserData = () => {
  //   queryClient.prefetchQuery({
  //     queryKey: ["users", user.id],
  //     queryFn: () => getUser(user.id),
  //   })
  // }

  return (
    <FormDialog>
      <FormDialog.Trigger>
        <Button
          // onMouseEnter={prefetchUserData}
          // onFocus={prefetchUserData} // ← Add for keyboard
          // onTouchStart={prefetchUserData} // ← Add for mobile
          variant="secondary"
          className="bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
          size="sm"
        >
          Update
        </Button>
      </FormDialog.Trigger>
      <FormDialog.Content>
        <UpdateCompanyForm company={company} companyId={company.id} />
      </FormDialog.Content>
    </FormDialog>
  )
}
