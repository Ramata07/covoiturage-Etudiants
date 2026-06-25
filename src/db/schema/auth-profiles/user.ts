import { pgTable, varchar } from "drizzle-orm/pg-core";
import { UserRoles, userRolesEnum } from "../enums";
import { createdAt, updatedAt } from "@/db/schema-helpers";

export const UsersTable = pgTable("users", {
  id: varchar("id", { length: 150 }).primaryKey(),
  nom: varchar("nom", { length: 200 }).notNull(),
  prenom: varchar("prenom", { length: 150 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 150 }).notNull(),
  role: userRolesEnum().notNull().default("client"),
  photo: varchar("photo", { length: 200 }).notNull(),
  created_At: createdAt(),
  updated_At: updatedAt(),
});

export type PublicUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;
};
