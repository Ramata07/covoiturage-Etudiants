import { pgTable, integer, date, varchar } from "drizzle-orm/pg-core";
import { UsersTable } from "../auth-profiles";
import { TrajetTable } from "../trajet";
import { createdAt, updatedAt } from "@/db/schema-helpers.js";


export const ReservationTable = pgTable("reservations", {

    id: varchar("id", { length: 100 }).primaryKey(),
    id_passager: varchar("id_passager", { length: 150 }).references(() => UsersTable.id),
    id_trajet: varchar("id_trajet", { length: 100 }).references(() => TrajetTable.id),
    dateReservation: date("dateReservation"),
    prix: integer("prix").notNull(),
    method_paiement: varchar("method_paiement",{length: 50}).notNull(),
    commentaire: varchar("commentaire", {length: 150}).notNull(),
    created_At: createdAt(),
    updated_At: updatedAt(),

});