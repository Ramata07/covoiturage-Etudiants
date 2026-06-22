import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { UsersTable } from "./auth-profiles/user";

export const VehiculeTable = pgTable("vehicules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  immatriculation: varchar("immatriculation", { length: 15 }).notNull(),
  proprio: varchar("proprio", { length: 150 })
    .references(() => UsersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  nbrePlaces: integer("nbrePlaces").notNull(),
  modele: varchar("modele", { length: 100 }).notNull(),
  couleur: varchar("couleur", { length: 100 }).notNull(),
  marque: varchar("marque", { length: 100 }).notNull(),
});
