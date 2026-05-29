import Form from "@/components/form/Form"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import type { CompanyType } from "@/types/dashboard.types"
// import { useSearchParams } from "react-router"
import { useUpdateCompanyMutation } from "./reactQueryHooks/useUpdateCompany"
import { useFormDialog } from "../hooks/useFormDialog"
import { useState } from "react"
import { uploadImage } from "@/lib/cloudinaryv1.utils"
import Image from "next/image"
import { companyKeys } from "@/lib/queryKeys"
import { useSearchParams } from "next/navigation"

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

interface UpdateCompanyFormProps {
  company: CompanyType
  companyId: string
}

export const UpdateCompanyForm = ({
  companyId,
  company,
}: UpdateCompanyFormProps) => {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const { onSuccess } = useFormDialog()
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

  // const [searchParams] = useSearchParams()

  const { updateCompanyMutation, isLoading: isUpdatingCompany } =
    useUpdateCompanyMutation(companyId)

  const name = company?.name ?? ""
  const email = company?.email ?? ""
  const address = company?.address ?? ""
  const logo = company?.logo ?? ""

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
    const logoUrl = companyLogo.url ?? logo ?? ""

    updateCompanyMutation(
      {
        name,
        email,
        address,
        logo: logoUrl,
      },
      {
        onSuccess: (updated: CompanyType) => {
          onSuccess?.()

          // queryClient.setQueryData(["companies", companyId], updated)

          const page = Number(searchParams?.get("page") ?? 1)

          queryClient.setQueryData(
            companyKeys.page(page),
            (old: { data: CompanyType[] }) => ({
              ...old,
              data: old.data.map((u) => (u.id === updated.id ? updated : u)),
            })
          )
          queryClient.invalidateQueries({
            queryKey: companyKeys.all,
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
          <Form.Label>Email</Form.Label>

          <Form.Input
            name="email"
            type="email"
            placeholder="company@example.com"
            defaultValue={email}
            disabled={isUpdatingCompany}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label>Name</Form.Label>

          <Form.Input
            name="name"
            placeholder="John Doe"
            required
            defaultValue={name}
            disabled={isUpdatingCompany}
          />
        </Form.Field>

        <Form.Field>
          <Form.Label>Address</Form.Label>

          <Form.Input
            name="address"
            type="text"
            placeholder="123 Main Street, Lahore"
            required
            defaultValue={address}
            disabled={isUpdatingCompany}
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
            disabled={isUpdatingCompany}
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
        </Form.Field>

        <Form.Actions>
          <Form.Submit disabled={isUpdatingCompany}>
            {isUpdatingCompany ? "Updating Company..." : "Update Company"}
          </Form.Submit>
        </Form.Actions>
      </Form>
    </>
  )
}
