// // project-members.schema.ts
// import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core"

// export const projectMemberRole = pgTable("project_members_role", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//     () => new Date()
//   ),
// })
