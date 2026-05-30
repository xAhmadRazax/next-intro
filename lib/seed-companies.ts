import { db } from "@/db"
import { companies } from "@/db/schema"
import { faker } from "@faker-js/faker"

async function seedCompanies(count: number = 50) {
  console.log(`🌱 Seeding ${count} companies...`)

  const companiesData = Array.from({ length: count }, () => ({
    name: faker.company.name(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    logo: null,
    logoPublicId: null,
  }))

  const result = await db.insert(companies).values(companiesData).returning()

  console.log(`✅ Created ${result.length} companies`)
  return result
}

// Run it
seedCompanies(50).catch(console.error)
