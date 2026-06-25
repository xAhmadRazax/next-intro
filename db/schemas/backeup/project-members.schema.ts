// // project-members.schema.ts
// import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core"
// import { users } from "./user.schema"
// import { relations } from "drizzle-orm"
// import { projects } from "./project.schema"
// import { jobTitles } from "./jobTitle.schema"
// import { taskAssignees } from "./task-assignees.schema"

// export const projectMembers = pgTable(
//   "project_members",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     projectId: uuid("project_id")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),

//     userId: uuid("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),

//     roleId: uuid("role_id").references(() => jobTitles.id, {
//       onDelete: "set null",
//     }),

//     joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
//     leftAt: timestamp("left_at", { withTimezone: true }),

//     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//       () => new Date()
//     ),
//   },
//   (table) => [
//     unique("project_members_unique").on(table.projectId, table.userId),
//   ]
// )

// export type ProjectMembersType = typeof projectMembers.$inferSelect

// export const projectMembersRelations = relations(
//   projectMembers,
//   ({ one, many }) => ({
//     project: one(projects, {
//       fields: [projectMembers.projectId],
//       references: [projects.id],
//     }),
//     user: one(users, {
//       fields: [projectMembers.userId],
//       references: [users.id],
//     }),
//     role: one(jobTitles, {
//       fields: [projectMembers.roleId],
//       references: [jobTitles.id],
//     }),
//     taskAssignments: many(taskAssignees), // added once task_assignees exists below
//   })
// )
