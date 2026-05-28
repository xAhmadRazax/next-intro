import crypto from "crypto"
import bcrypt from "bcryptjs"

export class TokenUtil {
  static async generate({
    bytesSize = 32,
    bufferEncoding = "hex",
    hashMethod = "sha256",
    rounds = 12,
  }: {
    bytesSize?: number
    bufferEncoding?: BufferEncoding
    hashMethod?: "sha256" | "bcrypt"
    rounds?: number
  } = {}) {
    const raw = crypto.randomBytes(bytesSize).toString(bufferEncoding)

    const hashed =
      hashMethod === "bcrypt"
        ? await bcrypt.hash(raw, rounds)
        : crypto.createHash("sha256").update(raw).digest("hex")

    return { raw, hashed }
  }

  static hashToken(raw: string) {
    return crypto.createHash("sha256").update(raw).digest("hex")
  }

  static async hashPassword(password: string, rounds = 12) {
    return await bcrypt.hash(password, rounds)
  }

  static async comparePassword(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed)
  }
}
