import { pgTable, varchar } from "drizzle-orm/pg-core";
import { UserRoles, userRolesEnum } from "../enums/enums";
import { createdAt, updatedAt } from "@/db/schema-helpers";

export const UsersTable = pgTable("users", {
  id: varchar("id", { length: 150 }).primaryKey(),
  nom: varchar("nom", { length: 200 }).notNull(),
  prenom: varchar("prenom", { length: 150 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  mot_de_passe: varchar("mot_de_passe", { length: 150 }).notNull(),
  role: userRolesEnum().notNull().default("client"),
  photo: varchar("photo", { length: 200 }),
  created_At: createdAt(),
  updated_At: updatedAt(),
});

export type PublicUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRoles;
  photo: string | null;
  created_At: string;
  updated_At: string;
};
