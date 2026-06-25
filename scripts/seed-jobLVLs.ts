import { db } from "@/db"
import { jobTitles, levels } from "@/db/schema"

// seed-job-titles.ts
async function seedJobLevel() {
  const departments = await db.query.departments.findMany()
  const deptMap = departments.reduce(
    (acc, dept) => {
      acc[dept.name] = dept.id
      return acc
    },
    {} as Record<string, string>
  )

  const levelData = [
    // Engineering
    {
      departmentId: deptMap["Engineering"],
      name: "Intern",
      levelNumber: 0,
      minExperience: 0,
    },
    {
      departmentId: deptMap["Engineering"],
      name: "Junior",
      levelNumber: 1,
      minExperience: 1,
    },
    {
      departmentId: deptMap["Engineering"],
      name: "Mid",
      levelNumber: 2,
      minExperience: 3,
    },
    {
      departmentId: deptMap["Engineering"],
      name: "Senior",
      levelNumber: 3,
      minExperience: 5,
    },
    {
      departmentId: deptMap["Engineering"],
      name: "Lead",
      levelNumber: 4,
      minExperience: 8,
    },
    {
      departmentId: deptMap["Engineering"],
      name: "Principal",
      levelNumber: 5,
      minExperience: 10,
    },

    // Finance
    // { departmentId: deptMap["Finance"], name: "Analyst", levelNumber: 0, minExperience: 0 },
    // { departmentId: deptMap["Finance"], name: "Senior Analyst", levelNumber: 1, minExperience: 2 },
    // { departmentId: deptMap["Finance"], name: "Manager", levelNumber: 2, minExperience: 5 },
    // { departmentId: deptMap["Finance"], name: "Director", levelNumber: 3, minExperience: 8 },
    // { departmentId: deptMap["Finance"], name: "VP", levelNumber: 4, minExperience: 12 },

    // // Sales
    // { departmentId: deptMap["Sales"], name: "SDR", levelNumber: 0, minExperience: 0 },
    // { departmentId: deptMap["Sales"], name: "BDR", levelNumber: 1, minExperience: 1 },
    // { departmentId: deptMap["Sales"], name: "Account Executive", levelNumber: 2, minExperience: 3 },
    // { departmentId: deptMap["Sales"], name: "Senior AE", levelNumber: 3, minExperience: 5 },
    // { departmentId: deptMap["Sales"], name: "Sales Manager", levelNumber: 4, minExperience: 7 },

    // // HR
    // { departmentId: deptMap["Human Resources"], name: "Coordinator", levelNumber: 0, minExperience: 0 },
    // { departmentId: deptMap["Human Resources"], name: "Generalist", levelNumber: 1, minExperience: 2 },
    // { departmentId: deptMap["Human Resources"], name: "Manager", levelNumber: 2, minExperience: 5 },
    // { departmentId: deptMap["Human Resources"], name: "Director", levelNumber: 3, minExperience: 8 },
  ]
  await db.insert(levels).values(levelData)
}

seedJobLevel()
