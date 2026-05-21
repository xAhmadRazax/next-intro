"use client"
import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUpdateEmployeeMutation } from "./hooks/useUpdateEmployeeMutation"
import { useQueryClient } from "@tanstack/react-query"
import type { EmployeeType } from "@/types/dashboard.types"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { uploadImage } from "@/lib/cloudinary.utils"
import { employeeKeys } from "@/lib/queryKeys"

interface UpdateEmployeeFormProps {
  employee: EmployeeType
  employeeId: string
  onSuccess: () => void
}

interface EmployeeAvatarState {
  previewUrl: string
  imageFile: File | null
}

export const UpdateEmployeeForm = ({
  onSuccess,
  employeeId,
  employee,
}: UpdateEmployeeFormProps) => {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const { updateEmployeeMutation, isLoading: isUpdatingEmployee } =
    useUpdateEmployeeMutation(employeeId)

  const [employeeAvatar, setEmployeeAvatar] = useState<EmployeeAvatarState>({
    imageFile: null,
    previewUrl: "",
  })
  const [employeeAvatarError, setEmployeeAvatarError] = useState<string>("")

  const username = employee?.username ?? ""
  const email = employee?.email ?? ""
  const avatar = employee?.avatar ?? ""

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

    let avatarUrl = ""
    if (employeeAvatar.imageFile) {
      const imageUrl = await uploadImage(employeeAvatar.imageFile)
      avatarUrl = imageUrl
    }

    updateEmployeeMutation(
      {
        username,
        email,
        avatar: avatarUrl,
      },
      {
        onSuccess: (updated: EmployeeType) => {
          onSuccess?.()

          // queryClient.setQueryData(["users", userId], updated)
          const page = Number(searchParams?.get("page") ?? 1)

          queryClient.setQueryData(
            employeeKeys.list(page),
            (old: { data: EmployeeType[] }) => ({
              ...old,
              data: old.data.map((u) => (u.id === updated.id ? updated : u)),
            })
          )
          queryClient.invalidateQueries({
            queryKey: employeeKeys.all,
          })
        },
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
          />
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
          />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="company">company</Form.Label>

          <Form.Input
            id="company"
            name="company"
            defaultValue={employee.company.name}
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
          {employeeAvatar.previewUrl ||
            (avatar && (
              <Image
                width={128}
                height={128}
                src={employeeAvatar.previewUrl || avatar}
                alt="user avatar"
                className="mt-2 h-32 w-32 object-cover"
              />
            ))}
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
