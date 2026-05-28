import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "./user.schema"
import { relations } from "drizzle-orm"

export const tokenTypeEnums = pgEnum("token_types", ["password_resets"])

export const tokens = pgTable("tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  type: tokenTypeEnums("type").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export const tokenRelations = relations(tokens, ({ one }) => ({
  user: one(users, { fields: [tokens.userId], references: [users.id] }),
}))
