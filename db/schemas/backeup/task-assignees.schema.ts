// // task-assignees.schema.ts
// import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core"
// import { relations } from "drizzle-orm"
// import { projectMembers } from "./project-members.schema"
// import { projectTasks } from "./project-tasks.schema"

// export const taskAssignees = pgTable(
//   "task_assignees",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),

//     taskId: uuid("task_id")
//       .notNull()
//       .references(() => projectTasks.id, { onDelete: "cascade" }),

//     projectMemberId: uuid("project_member_id")
//       .notNull()
//       .references(() => projectMembers.id, { onDelete: "cascade" }),

//     assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow(),
//   },
//   (table) => [
//     unique("task_assignees_unique").on(table.taskId, table.projectMemberId),
//   ]
// )

// export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
//   task: one(projectTasks, {
//     fields: [taskAssignees.taskId],
//     references: [projectTasks.id],
//   }),
//   projectMember: one(projectMembers, {
//     fields: [taskAssignees.projectMemberId],
//     references: [projectMembers.id],
//   }),
// }))
