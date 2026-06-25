// import {
//   uuid,
//   text,
//   timestamp,
//   pgTable,
//   boolean,
//   unique,
// } from "drizzle-orm/pg-core"
// import { departments } from "./backeup/department.schema"
// import { relations } from "drizzle-orm"

// export const jobTitles = pgTable(
//   "job_titles",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     name: text("name").notNull(),
//     departmentId: uuid("department_id")
//       .notNull()
//       .references(() => departments.id, { onDelete: "cascade" }),
//     description: text("description"),
//     isActive: boolean("is_active").default(true),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
//   },
//   (table) => [
//     {
//       unique: unique("job_title_department_unique").on(
//         table.name,
//         table.departmentId
//       ),
//     },
//   ]
// )

// export type JobTitleType = typeof jobTitles.$inferSelect

// export const jobTitlesRelations = relations(jobTitles, ({ one }) => ({
//   roles: one(departments, {
//     fields: [jobTitles.departmentId],
//     references: [departments.id],
//   }),
// }))
