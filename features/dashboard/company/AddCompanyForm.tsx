import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { useCreateCompanyMutation } from "./hooks/useCreateCompanyMutation"
import { useFormDialog } from "../hooks/useFormDialog"
import { useState } from "react"
// import { getImageDimensions, imageToBase64 } from "@/lib/imageUtils"
import { uploadImage } from "@/lib/cloudinary.utils"
import Image from "next/image"

interface CompanyLogoState {
  image: File | null
  previewUrl: string
  // base64String?: string
  // dimensions?: {
  //   width: number
  //   height: number
  // }
  fileName: string
  url: string
}

export const AddCompanyForm = () => {
  const { createCompanyMutation, isLoading: isCreatingCompany } =
    useCreateCompanyMutation()

  const [companyLogoError, setCompanyLogoError] = useState<string>("")

  console.log(companyLogoError)

  const [companyLogo, setCompanyLogo] = useState<CompanyLogoState>({
    image: null,
    previewUrl: "",
    fileName: "",
    // base64String: "",
    // dimensions: undefined,
    url: "",
  })

  const { onSuccess } = useFormDialog()

  const queryClient = useQueryClient()

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
    const logo = companyLogo.url ?? ""
    // get the file upload

    createCompanyMutation(
      {
        name,
        email,
        address,
        logo: logo,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["companies"],
          })

          onSuccess?.()
        },
      }
    )
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
            name="email"
            type="email"
            placeholder="jcompany@example.com"
            required
            disabled={isCreatingCompany}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="name">Name</Form.Label>

          <Form.Input
            id={"name"}
            name="name"
            placeholder="tech company"
            required
            disabled={isCreatingCompany}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="address">Address</Form.Label>

          <Form.Input
            name="address"
            type="text"
            placeholder="123 Main Street, Lahore"
            required
            min={0}
            disabled={isCreatingCompany}
          />
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
        </Form.Field>

        <Form.Actions>
          <Form.Submit disabled={isCreatingCompany}>
            {isCreatingCompany ? "Adding Company..." : "Add Company"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
