import { relations } from "drizzle-orm"
import {
  uuid,
  varchar,
  text,
  timestamp,
  pgTable,
  pgEnum,
} from "drizzle-orm/pg-core"
import { employees, EmployeeType } from "./employee.schema"
import { companies, CompanyType } from "./company.schema"
// import { companies, CompanyType } from "./company.schema"
// import { attendance } from "./attendance.schema"
// import { departments, DepartmentType } from "./department.schema"
// import { levels } from "./jobLevel.schema"
// import { jobTitles, JobTitleType } from "./jobTitle.schema"

export const roleEnum = pgEnum("role", ["admin", "employee", "company"])

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  employeeId: uuid("employee_id").references(() => employees.id, {
    onDelete: "cascade",
  }),
  companyId: uuid("company_id").references(() => companies.id, {
    onDelete: "cascade",
  }),

  role: roleEnum("role").notNull().default("employee"),
})

// 5. Relations

export type UserType = typeof users.$inferSelect

export type AuthenticateUser = typeof users.$inferSelect & {
  company?: CompanyType | null
  employee?: EmployeeType | null
  // department?: DepartmentType | null
  // jobTitle: JobTitleType | null
}

export type PublicUserType = Omit<AuthenticateUser, "password">

// where ever the FK lives that table will get one()
//  employees table HAS a foreign key (companyId)
// So employees BELONGS TO one company → use one()
// export const userRelations = relations(users, ({ one, many }) => ({
//   company: one(companies, {
//     fields: [users.companyId],
//     references: [companies.id],
//   }),
//   employee: one(employees, {
//     fields: [users.employeeId],
//     references: [employees.id],
//   }),
//   // attendance: many(attendance),
//   // department: one(departments, {
//   //   fields: [users.departmentId],
//   //   references: [departments.id],
//   // }),
//   // level: one(levels, {
//   //   fields: [users.levelId],
//   //   references: [levels.id],
//   // }),
//   // jobTitle: one(jobTitles, {
//   //   fields: [users.jobTitleId],
//   //   references: [jobTitles.id],
//   // }),
// }))

export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  employee: one(employees, {
    fields: [users.employeeId],
    references: [employees.id],
  }),
}))
