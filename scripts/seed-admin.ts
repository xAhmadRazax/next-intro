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
  const hashed = await TokenUtil.hashPassword("1234")
  await db.insert(users).values({
    email: adminEmail.toLowerCase(),
    password: hashed,
    name: adminName,
    role: "admin",
  })

  console.log(`password is 1234`)
}

seedAdmin()
