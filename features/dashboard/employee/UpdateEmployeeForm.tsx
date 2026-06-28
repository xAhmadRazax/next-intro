"use client"
import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import Image from "next/image"
import { PublicUserType } from "@/db/schema"
import { useFormDialog } from "../hooks/useFormDialog"
import { useUpdateEmployeeMutation } from "./hooks/useUpdateEmployeeMutation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmployeeType } from "@/types/dashboard.types"

interface UpdateEmployeeFormProps {
  employee: EmployeeType
  employeeId: string
  updateEmployeeInCache?: (updatedEmployee: EmployeeType) => void
}

interface EmployeeAvatarState {
  previewUrl: string
  imageFile: File | null
}

export const UpdateEmployeeForm = ({
  employeeId,
  employee,
  updateEmployeeInCache,
}: UpdateEmployeeFormProps) => {
  const {
    updateEmployeeMutation,
    isLoading: isUpdatingEmployee,

    clearFieldError,
    error,
  } = useUpdateEmployeeMutation()
  const [employeeAvatar, setEmployeeAvatar] = useState<EmployeeAvatarState>({
    imageFile: null,
    previewUrl: "",
  })

  const { onSuccess } = useFormDialog()
  const [employeeAvatarError, setEmployeeAvatarError] = useState<string>("")

  const username = employee?.name ?? ""
  const email = employee?.email ?? ""
  const avatar = employee?.avatar ?? ""
  const designation = employee?.designation
  const address = employee.address
  const phone = employee?.phone

  const usernameError = error?.fields?.name
  const emailError = error?.fields?.email
  const designationError = error?.fields?.designation
  const addressError = error?.fields?.address
  const phoneError = error?.fields?.phone

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

    const updatedUsername = formData.get("username") as string
    const updatedEmail = formData.get("email") as string
    const updatedAddress = formData.get("address") as string
    const updatedPhone = formData.get("phone") as string
    const updatedDesignation = formData.get("designation") as string

    const fieldsToUpdate: Record<string, string> = {}
    if (updatedUsername !== username) {
      fieldsToUpdate.username = updatedUsername
    }
    if (updatedEmail !== email) {
      fieldsToUpdate.email = updatedEmail
    }
    if (updatedAddress !== address) {
      fieldsToUpdate.address = updatedAddress
    }
    if (updatedPhone !== phone) {
      fieldsToUpdate.phone = updatedPhone
    }
    if (updatedDesignation !== designation) {
      fieldsToUpdate.designation = updatedDesignation
    }

    await updateEmployeeMutation(
      employeeId,
      {
        ...fieldsToUpdate,
        avatar: employeeAvatar?.imageFile ?? undefined,
      },
      (updatedEmployee) => {
        onSuccess()
        updateEmployeeInCache?.(updatedEmployee)
      }
    )
  }

  return (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="mb-2 text-xl text-primary">
          Update Employee
        </DialogTitle>
      </DialogHeader>

      <Form onSubmit={onSubmitHandler}>
        <Form.Field>
          <Form.Label htmlFor="email">Email</Form.Label>

          <Form.Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            defaultValue={email}
            disabled={isUpdatingEmployee}
            onFocus={() => {
              if (emailError) {
                clearFieldError("email")
              }
            }}
            className={`${emailError ? "ring-1 ring-destructive" : ""}`}
          />
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="username">Name</Form.Label>

          <Form.Input
            id="username"
            name="username"
            placeholder="John Doe"
            required
            defaultValue={username}
            disabled={isUpdatingEmployee}
            onFocus={() => {
              if (usernameError) {
                clearFieldError("username")
              }
            }}
            className={`${usernameError ? "ring-1 ring-destructive" : ""}`}
          />
          {usernameError && (
            <p className="text-sm text-destructive">{usernameError}</p>
          )}
        </Form.Field>

        {/* phone */}
        <Form.Field>
          <Form.Label htmlFor="phone">Phone</Form.Label>

          <Form.Input
            type="tel"
            name="phone"
            placeholder="03xx123456789"
            required
            disabled={isUpdatingEmployee}
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
            disabled={isUpdatingEmployee}
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

        <Form.Field>
          <Form.Label htmlFor="company">Company</Form.Label>

          <Form.Input
            id="company"
            name="company"
            defaultValue={employee.company!.name ?? ""}
            disabled={true}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="designation">Designation</Form.Label>

          <Select
            name="designation"
            defaultValue={employee.designation}
            required
            disabled={isUpdatingEmployee}
          >
            <SelectTrigger
              className={`w-full ${designationError ? "ring-1 ring-destructive" : ""}`}
            >
              <SelectValue placeholder="Select employee designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend-dev">
                Frontend Developer {/* Display text here */}
              </SelectItem>
              <SelectItem value="backend-dev">Backend Developer</SelectItem>
              <SelectItem value="project-manager">Project Manager</SelectItem>
            </SelectContent>
          </Select>

          {designationError && (
            <p className="text-sm text-destructive">{designationError}</p>
          )}
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="avatar">avatar</Form.Label>

          <Form.Input
            id={"avatar"}
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUpdatingEmployee}
          />

          {/* image preview */}
          {(employeeAvatar.previewUrl || avatar) && (
            <Image
              width={128}
              height={128}
              src={employeeAvatar.previewUrl || avatar}
              alt="user avatar"
              className="mt-2 h-32 w-32 object-cover"
            />
          )}

          {employeeAvatarError && (
            <p className="text-sm text-destructive">{employeeAvatarError}</p>
          )}
        </Form.Field>

        <Form.Actions>
          <Form.Submit disabled={isUpdatingEmployee}>
            {isUpdatingEmployee ? "Updating Employee..." : "Update Employee"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
