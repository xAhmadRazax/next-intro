// import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
// import { projects } from "./project.schema"
// import { users } from "./user.schema"
// import { relations } from "drizzle-orm"

// export const taskStatusEnum = pgEnum("status", [
//   "todo",
//   "in-progress",
//   "in-review",
//   "done",
// ])

// export const projectTasks = pgTable("project_tasks", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   name: text("name").notNull(),
//   status: taskStatusEnum("status").notNull().default("todo"),
//   description: text("description"),
//   projectId: uuid("project_id")
//     .notNull()
//     .references(() => projects.id, { onDelete: "cascade" }),
//   createdBy: uuid("created_by")
//     .references(() => users.id, {
//       onDelete: "set null",
//     })
//     .notNull(),

//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
//   updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
// })

// export const projectTasksRelations = relations(projectTasks, ({ one }) => ({
//   project: one(projects, {
//     fields: [projectTasks.projectId],
//     references: [projects.id],
//   }),
//   creator: one(users, {
//     fields: [projectTasks.createdBy],
//     references: [users.id],
//   }),
// }))
