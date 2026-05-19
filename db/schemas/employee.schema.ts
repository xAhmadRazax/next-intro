import { uuid, varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core"

export const employees = pgTable("employees", {
  id: uuid(`id`).defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  username: varchar("username", { length: 254 }).notNull(),

  avatar: text("text"),

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
