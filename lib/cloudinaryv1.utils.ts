// utils/cloudinary.ts
export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
}

export const uploadToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  console.log(cloudName, "cloudName")
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing. Check your .env file")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Upload failed")
    }

    const result = await response.json()
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}

// Optional: Delete image from Cloudinary (requires backend)
export const deleteFromCloudinary = async (publicId: string) => {
  // Note: For security, this should be done from your backend
  // Using your API secret. Don't expose API secret in frontend!
  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  })
  return response.json()
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()

  formData.append("file", file)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  console.log(cloudName, "cloudname")
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!uploadPreset) {
    throw new Error("Missing Cloudinary upload preset")
  }

  formData.append("upload_preset", uploadPreset)
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  const data = await response.json()

  console.log(data)

  return data.secure_url
}
