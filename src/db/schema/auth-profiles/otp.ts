import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";
import { createdAt, updatedAt, timestampTz } from "@/db/schema-helpers";

export const OtpTable = pgTable("otps", {
  id: varchar("id", { length: 100 }).primaryKey(),
  id_user: varchar("id_user", { length: 150 })
    .references(() => UsersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  code_hash: varchar("code_hash", { length: 64 }).notNull(),
  date_expiration: timestampTz("date_expiration").notNull(),
  utilise: boolean("utilise").notNull().default(false),
  created_At: createdAt(),
  updated_At: updatedAt(),
});
