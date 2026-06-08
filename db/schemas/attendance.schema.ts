import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { companies } from "./company.schema"
import { users } from "./user.schema"

export const attendances = pgTable("attendances", {
  companyId: uuid("company_id").references(() => companies.id),
  userId: uuid("user_id").references(() => users.id),
  check_in: timestamp("check_in", {
    withTimezone: true,
    mode: "date",
  }),
})
