import Form from "@/components/form/Form"
import { useFormDialog } from "../hooks/useFormDialog"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateUserMutation } from "./hooks/useCreateUserMutation"
import { useQueryClient } from "@tanstack/react-query"
import { useCompanies } from "../company/hooks/useCompanies"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { CompanyType } from "@/types/dashboard.types"
import { useState } from "react"

export const AddEmployeeForm = () => {
  const { createUserMutation, isLoading: isCreatingUser } =
    useCreateUserMutation()

  const { data, isLoading: isLoadingCompanies } = useCompanies(true)

  const queryClient = useQueryClient()
  const { onSuccess } = useFormDialog()

  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null
  )

  const handleCompanySelect = (company: string | null) => {
    if (!company) {
      return
    }
    const selected = data?.data.find((c) => c.name === company) || null
    setSelectedCompany(selected)

    console.log("Selected company:", company)
  }

  const onSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const age = formData.get("age") as string
    if (!selectedCompany) {
      alert("Please select a company for the employee.")
      return
    }

    createUserMutation(
      {
        name,
        email,
        age: +age,
        companyId: selectedCompany.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["users"],
          })

          onSuccess()
        },
      }
    )
  }

  return (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="mb-2 text-xl text-primary">
          Add Employee
        </DialogTitle>
      </DialogHeader>

      <Form onSubmit={onSubmitHandler}>
        <Form.Field>
          <Form.Label>Email</Form.Label>

          <Form.Input
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isCreatingUser}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label>Name</Form.Label>

          <Form.Input
            name="name"
            placeholder="John Doe"
            required
            disabled={isCreatingUser}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label>Age</Form.Label>

          <Form.Input
            name="age"
            type="number"
            placeholder="18"
            required
            min={0}
            disabled={isCreatingUser}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label>Company</Form.Label>
          <Combobox
            required
            items={data?.data ?? []}
            onValueChange={handleCompanySelect}
            disabled={isLoadingCompanies || isCreatingUser}
          >
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item: CompanyType) => (
                  <ComboboxItem key={item.id} value={item.name}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Form.Field>

        <Form.Actions>
          <Form.Submit disabled={isCreatingUser}>
            {isCreatingUser ? "Adding Employee..." : "Add Employee"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
