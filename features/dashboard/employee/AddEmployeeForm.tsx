"use client"

import { useState } from "react"
import Image from "next/image"
import { useCreateEmployeeMutation } from "./hooks/useCreateEmployeeMutation"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import Form from "@/components/form/Form"
import { useCompaniesQuery } from "../company/hooks/useCompaniesQuery"
import { CompanyType, PublicUserType } from "@/db/schema"
import { useFormDialog } from "../hooks/useFormDialog"

interface EmployeeAvatarState {
  previewUrl: string
  imageFile: File | null
}

export const AddEmployeeForm = ({
  addEmployeeToCache,
}: {
  addEmployeeToCache: (employee: PublicUserType) => void
}) => {
  const [employeeAvatar, setEmployeeAvatar] = useState<EmployeeAvatarState>({
    imageFile: null,
    previewUrl: "",
  })
  const [employeeAvatarError, setEmployeeAvatarError] = useState<string>("")

  const { onSuccess } = useFormDialog()

  const {
    createEmployeeHandler: createEmployeeMutation,
    error,
    isLoading: isCreatingEmployee,
    clearFieldError,
  } = useCreateEmployeeMutation()

  const { companies: companiesData, isLoading: isLoadingCompanies } =
    useCompaniesQuery()

  const companies = companiesData?.items || []

  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null
  )

  const emailError = error?.fields?.email
  const usernameError = error?.fields?.username
  const companyError = error?.fields?.company

  const handleCompanySelect = (company: CompanyType | null) => {
    if (!company) {
      return
    }
    setSelectedCompany(company)
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setEmployeeAvatarError(
          "Please select a valid image file (JPEG, PNG, GIF, or WEBP)"
        )
        return
      }

      setEmployeeAvatarError("")
      setEmployeeAvatar((prev) => ({
        ...prev,
        imageFile: file,
        previewUrl: URL.createObjectURL(file),
      }))
    }
  }
  const onSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const username = formData.get("username") as string
    const email = formData.get("email") as string

    createEmployeeMutation(
      {
        email,
        username,
        companyId: selectedCompany!.id,
        avatar: employeeAvatar.imageFile ?? undefined,
      },
      (employee) => {
        addEmployeeToCache(employee)
        onSuccess()
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
        {/* email input */}
        <Form.Field>
          <Form.Label>Email</Form.Label>

          <Form.Input
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isCreatingEmployee}
            className={`${emailError ? "ring-1 ring-destructive" : ""}`}
            onFocus={() => {
              if (emailError) {
                clearFieldError("email")
              }
            }}
          />
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </Form.Field>
        {/* end of email input */}
        {/* name input */}
        <Form.Field>
          <Form.Label>Name</Form.Label>

          <Form.Input
            name="username"
            placeholder="John Doe"
            required
            disabled={isCreatingEmployee}
            className={`${usernameError ? "ring-1 ring-destructive" : ""}`}
            onFocus={() => {
              if (usernameError) {
                clearFieldError("username")
              }
            }}
          />
          {emailError && (
            <p className="text-sm text-destructive">{usernameError}</p>
          )}
        </Form.Field>
        {/* end of name input */}

        {/* company input */}
        <Form.Field>
          <Form.Label htmlFor="company">Company</Form.Label>
          <Combobox
            id="company"
            disabled={isLoadingCompanies || isCreatingEmployee}
            items={companies ?? []}
            itemToStringLabel={(company: CompanyType) => company.name}
            onValueChange={(company) => handleCompanySelect(company)}
            required
          >
            <ComboboxInput placeholder="Search companies..." />
            <ComboboxContent>
              <ComboboxEmpty>No companies found.</ComboboxEmpty>
              <ComboboxList
                className={`${true ? "ring-1 ring-destructive" : ""}`}
                onFocus={() => {
                  if (companyError) {
                    clearFieldError("company")
                  }
                }}
              >
                {(company: CompanyType) => (
                  <ComboboxItem key={company.id} value={company}>
                    {company.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {companyError && (
            <p className="text-sm text-destructive">{companyError}</p>
          )}
        </Form.Field>
        {/* end of company input */}
        {/* avatar input */}
        <Form.Field>
          <Form.Label htmlFor="avatar">avatar</Form.Label>

          <Form.Input
            id={"avatar"}
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isCreatingEmployee}
          />

          {/* image preview */}
          {employeeAvatar.previewUrl && (
            <Image
              width={128}
              height={128}
              src={employeeAvatar.previewUrl}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover"
            />
          )}

          {employeeAvatarError && (
            <p className="text-sm text-destructive">{employeeAvatarError}</p>
          )}
        </Form.Field>

        <Form.Actions>
          <Form.Submit disabled={isCreatingEmployee}>
            {isCreatingEmployee ? "Adding Employee..." : "Add Employee"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
