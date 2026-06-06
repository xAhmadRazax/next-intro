import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFormDialog } from "../hooks/useFormDialog"
import { useState } from "react"
import Image from "next/image"
import { useUpdateCompanyMutation } from "./hooks/useUpdateCompanyMutation"
import { CompanyType } from "@/db/schema"

interface CompanyLogoState {
  image: File | null
  previewUrl: string
  fileName: string
  url: string
}

interface UpdateCompanyFormProps {
  company: CompanyType
  companyId: string
  updateItemSuccessCallback?: (company: CompanyType) => void
}

export const UpdateCompanyForm = ({
  companyId,
  company,
  updateItemSuccessCallback,
}: UpdateCompanyFormProps) => {
  const { onSuccess } = useFormDialog()
  const [companyLogoError, setCompanyLogoError] = useState<string>("")

  const { clearFieldError, updateCompanyMutation, error, isLoading } =
    useUpdateCompanyMutation()

  const [companyLogo, setCompanyLogo] = useState<CompanyLogoState>({
    image: null,
    previewUrl: "",
    fileName: "",
    url: "",
  })

  const name = company?.name ?? ""
  const email = company?.email ?? ""
  const address = company?.address ?? ""
  const logo = company?.logo ?? ""
  const emailError = error?.fields?.email
  const nameError = error?.fields?.name
  const addressError = error?.fields?.address

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setCompanyLogoError(
          "Please select a valid image file (JPEG, PNG, GIF, or WEBP)"
        )
        return
      }

      setCompanyLogoError("")
      setCompanyLogo((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
        fileName: file.name,
      }))
    }
  }

  const onSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const updatedName = formData.get("name") as string
    const updatedEmail = formData.get("email") as string
    const updatedAddress = formData.get("address") as string

    const fieldsToUpdates: Record<string, string> = {}
    if (updatedName && updatedName !== name) {
      fieldsToUpdates.name = updatedName
    }
    if (updatedAddress && updatedAddress !== address) {
      fieldsToUpdates.address = updatedAddress
    }
    if (updatedEmail && updatedEmail !== email) {
      fieldsToUpdates.email = updatedEmail
    }
    await updateCompanyMutation(
      companyId,
      {
        ...fieldsToUpdates,
        logo: companyLogo.image ?? undefined,
      },
      (updatedCompany) => {
        updateItemSuccessCallback?.(updatedCompany)
        onSuccess()
      }
    )
  }

  return (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="mb-2 text-xl text-primary">
          Update Company
        </DialogTitle>
      </DialogHeader>

      <Form onSubmit={onSubmitHandler}>
        <Form.Field>
          <Form.Label>Email</Form.Label>

          <Form.Input
            onFocus={() => {
              if (emailError) {
                clearFieldError("email")
              }
            }}
            name="email"
            type="email"
            placeholder="company@example.com"
            defaultValue={email}
            disabled={isLoading}
            className={`${addressError ? "ring-1 ring-destructive" : ""}`}
          />
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </Form.Field>

        <Form.Field>
          <Form.Label>Name</Form.Label>

          <Form.Input
            onFocus={() => {
              if (nameError) {
                clearFieldError("name")
              }
            }}
            name="name"
            placeholder="John Doe"
            required
            className={`${nameError ? "ring-1 ring-destructive" : ""}`}
            defaultValue={name}
            disabled={isLoading}
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        </Form.Field>

        <Form.Field>
          <Form.Label>Address</Form.Label>

          <Form.Input
            onFocus={() => {
              if (addressError) {
                clearFieldError("address")
              }
            }}
            name="address"
            type="text"
            placeholder="123 Main Street, Lahore"
            required
            className={`${addressError ? "ring-1 ring-destructive" : ""}`}
            defaultValue={address}
            disabled={isLoading}
          />
          {addressError && (
            <p className="text-sm text-destructive">{addressError}</p>
          )}
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="logo">Logo</Form.Label>

          <Form.Input
            id={"logo"}
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />

          {/* image preview */}
          {(companyLogo.previewUrl || logo) && (
            <Image
              width={128}
              height={128}
              src={companyLogo?.previewUrl || logo}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover"
            />
          )}
          {companyLogoError && (
            <p className="text-sm text-destructive">{companyLogoError}</p>
          )}
        </Form.Field>

        <Form.Actions>
          <Form.Submit disabled={isLoading}>
            {isLoading ? "Updating Company..." : "Update Company"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
