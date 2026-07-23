import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { UsersTable } from "../auth-profiles";
import { createdAt, updatedAt } from "@/db/schema-helpers.js";

export const VehiculeTable = pgTable("vehicules", {
  id: varchar("id", { length: 100 }).primaryKey(),
  immatriculation: varchar("immatriculation", { length: 15 }).notNull(),
  proprio: varchar("proprio", { length: 150 })
    .references(() => UsersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull()
    .unique(),

  nbre_places: integer("nbre_places").notNull(),
  modele: varchar("modele", { length: 100 }).notNull(),
  couleur: varchar("couleur", { length: 100 }).notNull(),
  marque: varchar("marque", { length: 100 }).notNull(),
  created_At: createdAt(),
  updated_At: updatedAt(),
});

export type PublicVehicule = {
  id: string;
  immatriculation: string;
  proprio: string;
  nbre_places: number;
  modele: string;
  couleur: string;
  marque: string;
  created_At: string;
  updated_At: string;
};
