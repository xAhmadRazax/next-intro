import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { companies } from "./company.schema"
import { users } from "./user.schema"
import { relations } from "drizzle-orm"

export const attendance = pgTable("attendance", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companies.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  checkIn: timestamp("check-in", {
    withTimezone: true,
    mode: "date",
  }),
  checkOut: timestamp("check-out", {
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
  user: one(users, {
    fields: [attendance.userId],
    references: [users.id],
  }),
}))

export type AttendanceType = typeof attendance.$inferSelect
