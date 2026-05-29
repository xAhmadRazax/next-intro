"use client"

import { useState } from "react"
import Image from "next/image"
import { uploadImage } from "@/lib/cloudinaryv1.utils"
import { useCreateEmployeeMutation } from "./hooks/useCreateEmployeeMutation"
import { useQueryClient } from "@tanstack/react-query"
import { useFormDialog } from "../hooks/useFormDialog"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { CompanyType } from "@/types/dashboard.types"
import Form from "@/components/form/Form"
import { employeeKeys } from "@/lib/queryKeys"
import { useAllCompanies } from "../company/reactQueryHooks/useAllCompanies"

interface EmployeeAvatarState {
  previewUrl: string
  imageFile: File | null
}

export const AddEmployeeForm = () => {
  const [employeeAvatar, setEmployeeAvatar] = useState<EmployeeAvatarState>({
    imageFile: null,
    previewUrl: "",
  })
  const [employeeAvatarError, setEmployeeAvatarError] = useState<string>("")

  const { createEmployeeMutation, isLoading: isCreatingEmployee } =
    useCreateEmployeeMutation()

  const { data: companiesData, isLoading: isLoadingCompanies } =
    useAllCompanies()

  const companies = companiesData?.data || []

  const queryClient = useQueryClient()
  const { onSuccess } = useFormDialog()

  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null
  )

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
    // let avatarUrl = ""
    // if (employeeAvatar.imageFile) {
    //   const imageUrl = await uploadImage(employeeAvatar.imageFile)
    //   avatarUrl = imageUrl
    // }

    if (!selectedCompany) {
      alert("Please select a company for the employee.")
      return
    }

    createEmployeeMutation(
      {
        username,
        email,
        companyId: selectedCompany.id,
        avatar: employeeAvatar.imageFile || undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: employeeKeys.all,
          })

          onSuccess()
        },
        onError(error) {
          console.log(error)
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
        {/* email input */}
        <Form.Field>
          <Form.Label>Email</Form.Label>

          <Form.Input
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isCreatingEmployee}
          />
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
          />
        </Form.Field>
        {/* end of name input */}

        {/* company input */}
        <Form.Field>
          <Form.Label htmlFor="company">Company</Form.Label>
          <Combobox
            id="company"
            disabled={isLoadingCompanies || isCreatingEmployee}
            items={companies || []}
            itemToStringLabel={(company: CompanyType) => company.name}
            onValueChange={(company) => handleCompanySelect(company)}
          >
            <ComboboxInput placeholder="Search companies..." />
            <ComboboxContent>
              <ComboboxEmpty>No companies found.</ComboboxEmpty>
              <ComboboxList>
                {(company: CompanyType) => (
                  <ComboboxItem key={company.id} value={company}>
                    {company.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
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
