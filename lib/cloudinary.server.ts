import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

class Cloudinary {
  private bufferUploadToCloudinary(
    buffer: Buffer,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          options,
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error || !result) return reject(error)

            resolve(result)
          }
        )
        .end(buffer)
    })
  }
  async streamUpload(
    file: File,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    const buffer = Buffer.from(await file.arrayBuffer())

    return this.bufferUploadToCloudinary(buffer, options)
  }

  async deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }
}

export const cloudinaryService = new Cloudinary()
