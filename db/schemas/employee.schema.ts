import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core"

export const employees = pgTable("employees", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  avatar: text("avatar"),
  //   avatarPublicId: text("logo_public_id"),
  address: text("address"),
  designation: text("designation"),
  phone: text("phone"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
})

export type EmployeeType = typeof employees.$inferSelect
