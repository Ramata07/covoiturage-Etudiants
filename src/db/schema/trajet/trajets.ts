import { pgTable, varchar, integer, date,time } from "drizzle-orm/pg-core";
import { UsersTable } from "../auth-profiles";
import { VehiculeTable } from "../vehicule";
import { createdAt, updatedAt } from "@/db/schema-helpers.js";


export const TrajetTable = pgTable("trajets", {

    id: varchar("id", { length: 100 }).primaryKey(),
    id_conducteur: varchar("id_conducteur", { length: 150 }).references(() => UsersTable.id),
    id_vehicule: varchar("id_vehicule", { length: 100 }).references(() => VehiculeTable.id),
    destination: varchar("destination", {length: 100}).notNull(),
    point_depart: varchar("point_depart", {length: 100}).notNull(),
    prix: integer("prix").notNull(),
    nbre_passagers: integer("nbre_passagers").notNull(),
    date_depart: date("date_depart"),
    nbre_places_dispo: integer("nbre_places_dispo").notNull(),
    nbre_places_restants: integer("nbre_places_restants").notNull(),
    statut: varchar("statut", {length: 20}).notNull(),
    heure_depart: varchar("heure_depart", {length: 20}).notNull(),
    heure_arrivee: varchar("heure_arrivee", {length: 20}).notNull(),
    created_At: createdAt(),
    updated_At: updatedAt(),

});