import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFormDialog } from "../hooks/useFormDialog"
import { useState } from "react"
// import { getImageDimensions, imageToBase64 } from "@/lib/imageUtils"
import { uploadImage } from "@/lib/cloudinaryv1.utils"
import Image from "next/image"
import { useCreateCompanyMutation } from "./hooks/useCreateCompanyMutation"
import { CompanyType } from "@/db/schemas/company.schema"
// import { useCreateCompanyMutation } from "./hooks/useCreateCompanyMutation"

interface CompanyLogoState {
  image: File | null
  previewUrl: string
  fileName: string
  url: string
}

export const AddCompanyForm = ({
  addCompanyCallbackHandler,
}: {
  addCompanyCallbackHandler?: (company: CompanyType) => void
}) => {
  const {
    isLoading: isCreatingCompany,
    error,
    clearFieldError,
    createCompanyHandler,
  } = useCreateCompanyMutation()

  const [companyLogoError, setCompanyLogoError] = useState<string>("")

  const emailError = error?.fields?.email
  const nameError = error?.fields?.name
  const addressError = error?.fields?.address

  const [companyLogo, setCompanyLogo] = useState<CompanyLogoState>({
    image: null,
    previewUrl: "",
    fileName: "",
    url: "",
  })

  const { onSuccess } = useFormDialog()

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

      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        setCompanyLogo((prev) => ({
          ...prev,
          url: imageUrl,
        }))
      }
    }
  }

  const onSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    // get the file upload

    const newCompanyData = await createCompanyHandler({
      email,
      name,
      address,
      logo: companyLogo?.image ?? undefined,
    })

    if (newCompanyData) {
      addCompanyCallbackHandler?.(newCompanyData)
      onSuccess()
    }
  }

  return (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="mb-2 text-xl text-primary">
          Add Company
        </DialogTitle>
      </DialogHeader>

      <Form onSubmit={onSubmitHandler}>
        <Form.Field>
          <Form.Label htmlFor="email">Email</Form.Label>

          <Form.Input
            id={"email"}
            onFocus={() => {
              if (emailError) {
                clearFieldError("email")
              }
            }}
            name="email"
            type="email"
            className={`${emailError ? "ring-1 ring-destructive" : ""}`}
            placeholder="jcompany@example.com"
            required
            disabled={isCreatingCompany}
          />
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="name">Name</Form.Label>

          <Form.Input
            onFocus={() => {
              if (nameError) {
                clearFieldError("name")
              }
            }}
            id={"name"}
            name="name"
            className={`${nameError ? "ring-destructive" : ""}`}
            placeholder="tech company"
            required
            disabled={isCreatingCompany}
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="address">Address</Form.Label>

          <Form.Input
            onFocus={() => {
              if (addressError) {
                clearFieldError("address")
              }
            }}
            name="address"
            className={`${addressError ? "ring-destructive" : ""}`}
            type="text"
            placeholder="123 Main Street, Lahore"
            required
            min={0}
            disabled={isCreatingCompany}
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
            disabled={isCreatingCompany}
          />

          {/* image preview */}
          {companyLogo.previewUrl && (
            <Image
              width={128}
              height={128}
              src={companyLogo.previewUrl}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover"
            />
          )}

          {companyLogoError && (
            <p className="text-sm text-destructive">{companyLogoError}</p>
          )}
        </Form.Field>

        <Form.Actions>
          <Form.Submit
            disabled={isCreatingCompany}
            className={`${isCreatingCompany ? "animate-pulse" : ""}`}
          >
            {isCreatingCompany ? "Adding Company..." : "Add Company"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
