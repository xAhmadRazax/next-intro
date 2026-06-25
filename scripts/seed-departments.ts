import { db } from "@/db"
import { departments } from "@/db/schemas/backeup/department.schema"

const departmentData = [
  {
    name: "Engineering",
    description: "Software development, architecture, and technical innovation",
  },
  //   {
  //     name: "Finance",
  //     description: "Financial planning, accounting, and budget management",
  //   },

  //   {
  //     name: "Human Resources",
  //     description:
  //       "Talent management, employee relations, and organizational development",
  //   },
  //   {
  //     name: "Marketing",
  //     description: "Brand management, digital marketing, and customer engagement",
  //   },

  //   {
  //     name: "Customer Support",
  //     description: "Customer service, technical support, and client success",
  //   },

  //   {
  //     name: "Legal",
  //     description: "Legal compliance, contracts, and regulatory affairs",
  //   },
]

async function seedDepartment() {
  try {
    console.log("....start seeding departments")
    await db.insert(departments).values(departmentData)
    console.log("departments seeded successfully")
  } catch (error) {
    console.log("something went wrong while seeding data")
    console.log(error)
  }
}

seedDepartment()
