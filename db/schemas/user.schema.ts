import { relations } from "drizzle-orm"
import {
  uuid,
  varchar,
  text,
  timestamp,
  pgTable,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core"
import { companies } from "./company.schema"

export const roleEnum = pgEnum("role", ["admin", "employee"])

export const users = pgTable("users", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  username: varchar("username", { length: 254 }).notNull(),
  companyId: uuid("company_id").references(() => companies.id),
  role: roleEnum("role").notNull().default("employee"),
  password: text("password").notNull(),

  avatar: text("avatar"),
  avatarPublicId: text("avatar_public_id"),

  mustChangePassword: boolean("must_change_password").default(true),
  passwordExpiresAt: timestamp("password_expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
})

export type UserType = typeof users.$inferSelect

// where ever the FK lives that table will get one()
//  employees table HAS a foreign key (companyId)
// So employees BELONGS TO one company → use one()
export const employeesRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
}))
