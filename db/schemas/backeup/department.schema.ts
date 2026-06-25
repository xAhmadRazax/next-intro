// import { relations } from "drizzle-orm"
// import { uuid, text, timestamp, pgTable } from "drizzle-orm/pg-core"
// import { jobTitles } from "../jobTitle.schema"

// export const departments = pgTable("departments", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   name: text("name").notNull().unique(),
//   description: text("description"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
// })

// export const departmentsRelations = relations(departments, ({ many }) => ({
//   roles: many(jobTitles),
// }))

// export type DepartmentType = typeof departments.$inferSelect
