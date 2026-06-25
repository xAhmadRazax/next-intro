// import {
//   uuid,
//   text,
//   timestamp,
//   pgTable,
//   integer,
//   boolean,
//   unique,
// } from "drizzle-orm/pg-core"
// import { departments } from "./backeup/department.schema"

// export const levels = pgTable(
//   "levels",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     departmentId: uuid("department_id")
//       .notNull()
//       .references(() => departments.id, { onDelete: "cascade" }),
//     name: text("name").notNull(),
//     levelNumber: integer("level_number").notNull(),
//     description: text("description"),
//     minExperience: integer("min_experience_years"),
//     isActive: boolean("is_active").default(true),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
//   },
//   (table) => [
//     {
//       unique: unique("level_department_unique").on(
//         table.departmentId,
//         table.name
//       ),
//     },
//   ]
// )
