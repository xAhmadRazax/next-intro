"use client"

import { useEffect, useState } from "react"
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
import { useFormDialog } from "../hooks/useFormDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CompanyType, EmployeeType } from "@/types/dashboard.types"
import { useAuthContext } from "@/context/auth.context"

interface EmployeeAvatarState {
  previewUrl: string
  imageFile: File | null
}

export const AddEmployeeForm = ({
  addEmployeeToCache,
}: {
  addEmployeeToCache?: (employee: EmployeeType) => void
}) => {
  const { user } = useAuthContext()

  const {
    createEmployeeHandler: createEmployeeMutation,
    error,
    isLoading: isCreatingEmployee,
    clearFieldError,
  } = useCreateEmployeeMutation()

  const { companiesQueryHandler, isLoading: isLoadingCompanies } =
    useCompaniesQuery()

  const { onSuccess } = useFormDialog()

  const [employeeAvatar, setEmployeeAvatar] = useState<EmployeeAvatarState>({
    imageFile: null,
    previewUrl: "",
  })
  const [employeeAvatarError, setEmployeeAvatarError] = useState<string>("")

  const [companies, setCompanies] = useState<CompanyType[] | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null
  )

  // const [selectedDepartment, setSelectedDepartment] =
  // useState<DepartmentsWithRolesType | null>(null)

  // const [selectedRole, setSelectedRole] = useState<JobTitleType | null>(null)

  useEffect(() => {
    async function fetchAllCompaniesData() {
      const res = await companiesQueryHandler({ getAll: true })

      console.log(res)

      setCompanies(res ?? [])
    }

    fetchAllCompaniesData()
  }, [])

  const emailError = error?.fields?.email
  const nameError = error?.fields?.name
  const companyError = error?.fields?.company
  const passwordError = error?.fields?.password
  // const departmentError = error?.fields?.department
  const designationError = error?.fields?.designation
  const phoneError = error?.fields?.phone
  const addressError = error?.fields?.address

  const handleCompanySelect = (company: CompanyType | null) => {
    if (!company) {
      return
    }
    setSelectedCompany(company)
  }

  // const handleDepartmentSelect = (
  //   department: DepartmentsWithRolesType | null
  // ) => {
  //   if (!department) {
  //     return
  //   }
  //   setSelectedDepartment(department)
  // }

  // const handleRoleSelect = (role: JobTitleType | null) => {
  //   if (!role) {
  //     return
  //   }
  //   setSelectedRole(role)
  // }

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

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const designation = formData.get("designation") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    console.log("company", selectedCompany)

    createEmployeeMutation(
      {
        email,
        name,
        password,
        designation,
        phone,
        address,
        companyId: selectedCompany?.id || undefined,
        avatar: employeeAvatar.imageFile ?? undefined,
      },
      (employee) => {
        addEmployeeToCache?.(employee)
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
            name="name"
            placeholder="John Doe"
            required
            disabled={isCreatingEmployee}
            className={`${nameError ? "ring-1 ring-destructive" : ""}`}
            onFocus={() => {
              if (nameError) {
                clearFieldError("username")
              }
            }}
          />
          {emailError && (
            <p className="text-sm text-destructive">{nameError}</p>
          )}
        </Form.Field>
        {/* end of name input */}

        {/* password */}
        <Form.Field>
          <Form.Label htmlFor="password">Password</Form.Label>

          <Form.Input
            name="password"
            placeholder="*****"
            required
            disabled={isCreatingEmployee}
            className={`${passwordError ? "ring-1 ring-destructive" : ""}`}
            onFocus={() => {
              if (passwordError) {
                clearFieldError("password")
              }
            }}
          />
          {passwordError && (
            <p className="text-sm text-destructive">{passwordError}</p>
          )}
        </Form.Field>
        {/* end of password */}

        {/* phone */}
        <Form.Field>
          <Form.Label htmlFor="phone">Phone</Form.Label>

          <Form.Input
            type="tel"
            name="phone"
            placeholder="03xx123456789"
            required
            disabled={isCreatingEmployee}
            className={`${phoneError ? "ring-1 ring-destructive" : ""}`}
            onFocus={() => {
              if (phoneError) {
                clearFieldError("phone")
              }
            }}
          />
          {phoneError && (
            <p className="text-sm text-destructive">{phoneError}</p>
          )}
        </Form.Field>
        {/* end of password */}

        {/* address */}
        <Form.Field>
          <Form.Label htmlFor="address">Address</Form.Label>

          <Form.Input
            name="address"
            placeholder="address"
            required
            disabled={isCreatingEmployee}
            className={`${addressError ? "ring-1 ring-destructive" : ""}`}
            onFocus={() => {
              if (addressError) {
                clearFieldError("address")
              }
            }}
          />
          {addressError && (
            <p className="text-sm text-destructive">{addressError}</p>
          )}
        </Form.Field>
        {/* end of password */}

        {/* company input */}
        {user?.role && user?.role === "admin" && (
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
        )}
        {/* end of company input */}

        {/* address */}
        <Form.Field>
          <Form.Label htmlFor="designation">Designation</Form.Label>

          <Select name="designation" required disabled={isCreatingEmployee}>
            <SelectTrigger
              className={`w-full ${designationError ? "ring-1 ring-destructive" : ""}`}
            >
              <SelectValue placeholder="Select employee designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend-dev">Frontend Developer</SelectItem>
              <SelectItem value="backend-dev">Backend Developer</SelectItem>
              <SelectItem value="project-manager">Project Manager</SelectItem>
            </SelectContent>
          </Select>

          {designationError && (
            <p className="text-sm text-destructive">{designationError}</p>
          )}
        </Form.Field>
        {/* end of password */}

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
