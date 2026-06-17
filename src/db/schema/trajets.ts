import { pgTable, varchar, integer, date,time } from "drizzle-orm/pg-core";
import { UsersTable } from "./auth-profiles/user.js";
import { VehiculeTable } from "./vehicules.js";

export const TrajetTable = pgTable("trajets", {

    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    id_conducteur: integer("id_conducteur").references(() => UsersTable.id),
    id_vehicule: integer("id_vehicule").references(() => VehiculeTable.id),
    destination: varchar("destination", {length: 100}).notNull(),
    pointDepart: varchar("pointDepart", {length: 100}).notNull(),
    prix: integer("prix").notNull(),
    nbrePassagers: integer("nbrePassagers").notNull(),
    date_depart: date("date_depart"),
    nbrePlacesDispo: integer("nbrePlacesDispo").notNull(),
    nbrePlacesRestants: integer("nbrePlacesRestants").notNull(),
    statut: varchar("statut", {length: 20}).notNull(),
    heureDepart: time("heureDepart"),
    heureArrivee: time("heureArrivee"),

});