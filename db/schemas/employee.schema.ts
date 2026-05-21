import { relations } from "drizzle-orm"
import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core"
import { companies } from "./company.schema"

export const employees = pgTable("employees", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  username: varchar("username", { length: 254 }).notNull(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),

  avatar: text("avatar"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
})

export type Employee = typeof employees.$inferSelect

// where ever the FK lives that table will get one()
//  employees table HAS a foreign key (companyId)
// So employees BELONGS TO one company → use one()
export const employeesRelations = relations(employees, ({ one }) => ({
  company: one(companies, {
    fields: [employees.companyId],
    references: [companies.id],
  }),
}))
