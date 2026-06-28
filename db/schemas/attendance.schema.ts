import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { companies } from "./company.schema"
import { users } from "./user.schema"
import { relations } from "drizzle-orm"
import { employees } from "./employee.schema"

export const attendance = pgTable("attendance", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companies.id, {
    onDelete: "cascade",
  }),
  employeeId: uuid("employee_id").references(() => employees.id, {
    onDelete: "cascade",
  }),
  checkIn: timestamp("check_in", {
    withTimezone: true,
    mode: "date",
  }),
  checkOut: timestamp("check_out", {
    withTimezone: true,
    mode: "date",
  }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export const attendanceRelations = relations(attendance, ({ one }) => ({
  company: one(companies, {
    fields: [attendance.companyId],
    references: [companies.id],
  }),
  employees: one(users, {
    fields: [attendance.employeeId],
    references: [users.id],
  }),
}))

export type AttendanceType = typeof attendance.$inferSelect
