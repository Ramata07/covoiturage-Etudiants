import { pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const VehiculeTable = pgTable("vehicules", {

    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    immatriculation: varchar("immatriculation", {length: 15}).notNull(),
    proprio: varchar("proprio", {length: 100}).notNull(),
    nbrePlaces: integer("nbrePlaces").notNull(),
    modele: varchar("modele", {length: 100}).notNull(),
    couleur: varchar("couleur", {length: 100}).notNull(),
    marque: varchar("marque", {length: 100}).notNull(),

}); 