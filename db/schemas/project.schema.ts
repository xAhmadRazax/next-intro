// import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core"
// import { PublicUserType, users } from "./user.schema"
// import { relations } from "drizzle-orm"
// import { projectMembers, ProjectMembersType } from "./project-members.schema"

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { employees } from "./employee.schema"

// export const statusEnum = pgEnum("status", [
//   "active",
//   "completed",
//   "pending",
//   "delayed",
// ])

// export const projects = pgTable("projects", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   name: text("name").notNull(),
//   status: statusEnum("status").notNull().default("pending"),
//   description: text("description"),

//   startDate: timestamp("start_date", { withTimezone: true }),
//   endDate: timestamp("end_date", { withTimezone: true }),

//   projectManager: uuid("project_manager").references(() => users.id, {
//     onDelete: "set null",
//   }),

//   owner: uuid("owner")
//     .references(() => users.id, { onDelete: "restrict" })
//     .notNull(),

//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
//   updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
// })

// export type ProjectType = typeof projects.$inferSelect & {
//   manager?: PublicUserType | null
//   creator?: PublicUserType | null
//   members: ProjectMembersType | null
// }

// // projects table HAS three foreign keys (companyId, projectManager, assignBy)
// // So projects BELONGS TO one company, one PM, one creator → use one() for all three
// export const projectsRelations = relations(projects, ({ one, many }) => ({
//   manager: one(users, {
//     fields: [projects.projectManager],
//     references: [users.id],
//   }),
//   creator: one(users, {
//     fields: [projects.owner],
//     references: [users.id],
//   }),
//   members: many(projectMembers),
// }))

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  client: text("client"),
  projectManager: uuid("project_manager").references(() => employees.id, {
    onDelete: "set null",
  }),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
})
