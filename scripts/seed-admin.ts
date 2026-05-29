import { db } from "@/db"
import { users } from "@/db/schema"
import { TokenUtil } from "@/lib/token.server"

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminName = process.env.ADMIN_NAME
  if (!adminEmail) {
    return console.log("ADMIN_EMAIL Env variable not set")
  }
  if (!adminName) {
    return console.log("ADMIN_NAME Env variable not set")
  }
  const { raw, hashed } = await TokenUtil.generate({
    bytesSize: 4,
    bufferEncoding: "base64",
    hashMethod: "bcrypt",
  })

  await db.insert(users).values({
    email: adminEmail.toLowerCase(),
    password: hashed,
    username: adminName,
    role: "admin",
    mustChangePassword: false,
    passwordExpiresAt: null,
  })

  console.log(`password is ${raw}-`)
}

seedAdmin()
