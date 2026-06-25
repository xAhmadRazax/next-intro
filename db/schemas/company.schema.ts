import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core"
import { PublicUserType, UserType } from "./user.schema"

export const companies = pgTable("companies", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  logo: text("logo"),
  // logoPublicId: text("logo_public_id"),

  address: text("address"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
})

export type CompanyType = PublicUserType & {
  company: typeof companies.$inferSelect
}
