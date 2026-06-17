import { timestamp, uuid } from "drizzle-orm/pg-core";

export const primaryId = () => uuid("id").primaryKey().defaultRandom();

export const timestampTz = (name: string) =>
  timestamp(name, {
    withTimezone: true,
    mode: "string",
  });

export const createdAt = () => timestampTz("created_at").notNull().defaultNow();

export const updatedAt = () =>
  timestampTz("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString());