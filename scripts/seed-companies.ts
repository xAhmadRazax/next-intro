import { db } from "@/db"
import { companies, users } from "@/db/schema"
import { faker } from "@faker-js/faker"

async function seedCompanies(row = 50) {
  // const companyEmail = faker.company.

  const companiesArray = Array.from({ length: row }).map(async () => {
    const name = faker.company.name()
    const email = faker.internet.email()
    const address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}, ${faker.location.country()}`

    //  await db.insert(companies).values(companiesArray)

    const [company] = await db
      .insert(companies)
      .values({ name, email, address })
      .returning()
    const user = await db.insert(users).values({
      email,
      name,
      password: "1234",
      role: "company",
      companyId: company!.id!,
    })

    // return {
    //   email: companyEmail,
    //   name: companyName,
    //   address: fullAddress,
    //   slug: companySlug,
    // }
  })

  // await db.insert(companies).values(companiesArray)
}

seedCompanies(50)
