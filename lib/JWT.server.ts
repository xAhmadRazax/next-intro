import { SignJWT, jwtVerify } from "jose"
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_EXPIRY = process.env.JWT_EXPIRY

export class JWT {
  static async signJWT({
    id,
    role,
    companySlug,
  }: {
    id: string
    role: string
    companySlug: string
  }) {
    return await new SignJWT({ id, role, companySlug })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRY!)
      .sign(SECRET)
  }
  static async safeVerifyJWT(
    token: string
  ): Promise<{ id: string; role: string; companySlug: string } | null> {
    try {
      const { payload } = await jwtVerify(token, SECRET)
      return payload as { id: string; role: string; companySlug: string }
    } catch {
      return null
    }
  }
}
