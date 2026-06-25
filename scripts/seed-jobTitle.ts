import { db } from "@/db"
import { jobTitles } from "@/db/schema"

// seed-job-titles.ts
async function seedJobTitles() {
  const departments = await db.query.departments.findMany()
  const deptMap = departments.reduce(
    (acc, dept) => {
      acc[dept.name] = dept.id
      return acc
    },
    {} as Record<string, string>
  )

  const jobTitleData = [
    // ===== ENGINEERING DEPARTMENT =====
    {
      name: "Frontend Developer",
      departmentId: deptMap["Engineering"],
      description: "Develops user interfaces and frontend applications",
    },
    {
      name: "Backend Developer",
      departmentId: deptMap["Engineering"],
      description: "Develops server-side logic and APIs",
    },
    {
      name: "Fullstack Developer",
      departmentId: deptMap["Engineering"],
      description: "Develops both frontend and backend systems",
    },
    {
      name: "DevOps Engineer",
      departmentId: deptMap["Engineering"],
      description: "Manages infrastructure and deployment pipelines",
    },
    {
      name: "QA Engineer",
      departmentId: deptMap["Engineering"],
      description: "Ensures software quality through testing",
    },
    {
      name: "Project Manager",
      departmentId: deptMap["Engineering"],
      description:
        "[lans, executes, and finalizes projects according to strict deadlines and budgets",
    },

    // ===== FINANCE DEPARTMENT =====
    // {
    //   name: "Financial Analyst",
    //   departmentId: deptMap["Finance"],
    //   description: "Analyzes financial data and creates reports",
    // },
    // {
    //   name: "Senior Financial Analyst",
    //   departmentId: deptMap["Finance"],
    //   description: "Senior-level financial analysis and forecasting",
    // },
    // {
    //   name: "Accountant",
    //   departmentId: deptMap["Finance"],
    //   description: "Manages financial records and transactions",
    // },
    // {
    //   name: "Finance Manager",
    //   departmentId: deptMap["Finance"],
    //   description: "Manages finance team and operations",
    // },
    // {
    //   name: "Controller",
    //   departmentId: deptMap["Finance"],
    //   description: "Oversees accounting operations",
    // },

    // // ===== SALES DEPARTMENT =====
    // {
    //   name: "Sales Development Representative",
    //   departmentId: deptMap["Sales"],
    //   description: "Generates and qualifies sales leads",
    // },
    // {
    //   name: "Account Executive",
    //   departmentId: deptMap["Sales"],
    //   description: "Manages client accounts and closes deals",
    // },
    // {
    //   name: "Senior Account Executive",
    //   departmentId: deptMap["Sales"],
    //   description: "Senior-level client management and sales",
    // },
    // {
    //   name: "Sales Manager",
    //   departmentId: deptMap["Sales"],
    //   description: "Manages sales team and strategy",
    // },
    // {
    //   name: "Sales Director",
    //   departmentId: deptMap["Sales"],
    //   description: "Directs sales operations and strategy",
    // },

    // // ===== HR DEPARTMENT =====
    // {
    //   name: "HR Coordinator",
    //   departmentId: deptMap["HR"],
    //   description: "Coordinates HR activities and processes",
    // },
    // {
    //   name: "HR Generalist",
    //   departmentId: deptMap["HR"],
    //   description: "Handles various HR functions and employee relations",
    // },
    // {
    //   name: "Recruiter",
    //   departmentId: deptMap["HR"],
    //   description: "Manages talent acquisition and recruitment",
    // },
    // {
    //   name: "HR Manager",
    //   departmentId: deptMap["HR"],
    //   description: "Manages HR team and operations",
    // },

    // // ===== MARKETING DEPARTMENT =====
    // {
    //   name: "Marketing Specialist",
    //   departmentId: deptMap["Marketing"],
    //   description: "Executes marketing campaigns and strategies",
    // },
    // {
    //   name: "Content Writer",
    //   departmentId: deptMap["Marketing"],
    //   description: "Creates content for marketing materials",
    // },
    // {
    //   name: "SEO Specialist",
    //   departmentId: deptMap["Marketing"],
    //   description: "Optimizes content for search engines",
    // },
    // {
    //   name: "Marketing Manager",
    //   departmentId: deptMap["Marketing"],
    //   description: "Manages marketing team and strategy",
    // },
  ]

  await db.insert(jobTitles).values(jobTitleData)
}

seedJobTitles()
