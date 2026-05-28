import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core"

export const companies = pgTable("companies", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  name: varchar("name", { length: 254 }).notNull(),
  address: text("address").notNull(),
  logo: text("logo"),
  logoPublicId: text("logo_public_id"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
})

export type CompanyType = typeof companies.$inferSelect
