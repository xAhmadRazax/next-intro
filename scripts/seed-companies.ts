import { db } from "@/db"
import { companies } from "@/db/schema"
import { faker } from "@faker-js/faker"
import slugify from "slugify"

async function seedCompanies(row = 50) {
  // const companyEmail = faker.company.

  const companiesArray = Array.from({ length: row }).map(() => {
    const companyName = faker.company.name()
    const companyEmail = faker.internet.email()
    const fullAddress = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}, ${faker.location.country()}`
    const companySlug = slugify(companyName)

    return {
      email: companyEmail,
      name: companyName,
      address: fullAddress,
      slug: companySlug,
    }
  })

  await db.insert(companies).values(companiesArray)
}

seedCompanies()
