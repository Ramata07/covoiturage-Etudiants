import { pgTable, integer, date, varchar } from "drizzle-orm/pg-core";
import { UsersTable } from "../auth-profiles/user.js";
import { TrajetTable } from "../trajet/trajets.js";
import { createdAt, updatedAt } from "@/db/schema-helpers.js";


export const ReservationTable = pgTable("reservations", {

    id: varchar("id", { length: 100 }).notNull(),
    id_passager: integer("id_passager").references(() => UsersTable.id),
    id_trajet: integer("id_trajet").references(()=> TrajetTable.id),
    dateReservation: date("dateReservation"),
    prix: integer("prix").notNull(),
    method_paiement: varchar("method_paiement",{length: 50}).notNull(),
    commentaire: varchar("commentaire", {length: 150}).notNull(),
    created_At: createdAt(),
    updated_At: updatedAt(),

});