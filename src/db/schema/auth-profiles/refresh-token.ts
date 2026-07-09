import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";
import { createdAt, updatedAt, timestampTz } from "@/db/schema-helpers";

export const RefreshTokenTable = pgTable("refresh_tokens", {
  id: varchar("id", { length: 100 }).primaryKey(),
  id_user: varchar("id_user", { length: 150 })
    .references(() => UsersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  token_hash: varchar("token_hash", { length: 64 }).notNull().unique(),
  date_expiration: timestampTz("date_expiration").notNull(),
  invalider_token: boolean("invalider_token").notNull().default(false),
  created_At: createdAt(),
  updated_At: updatedAt(),
});
