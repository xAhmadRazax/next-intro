"use client"
import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import Image from "next/image"
import { PublicUserType } from "@/db/schema"
import { useFormDialog } from "../hooks/useFormDialog"
import { useUpdateEmployeeMutation } from "./hooks/useUpdateEmployeeMutation"

interface UpdateEmployeeFormProps {
  employee: PublicUserType
  employeeId: string
  updateEmployeeInCache?: (updatedEmployee: PublicUserType) => void
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

  const username = employee?.username ?? ""
  const email = employee?.email ?? ""
  const avatar = employee?.avatar ?? ""

  const usernameError = error?.fields?.userName
  const emailError = error?.fields?.email

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

    const fieldsToUpdate: Record<string, string> = {}
    if (updatedUsername !== username) {
      fieldsToUpdate.username = updatedUsername
    }
    if (updatedEmail !== email) {
      fieldsToUpdate.email = updatedEmail
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
          <Form.Label htmlFor="username">Username</Form.Label>

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
          <Form.Label htmlFor="department">Department</Form.Label>

          <Form.Input
            id="department"
            name="department"
            defaultValue={employee.department!.name ?? "___"}
            disabled={true}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="jobTitle">Role</Form.Label>

          <Form.Input
            id="jobTitle"
            name="jobTitle"
            defaultValue={employee.jobTitle!.name ?? ""}
            disabled={true}
          />
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
