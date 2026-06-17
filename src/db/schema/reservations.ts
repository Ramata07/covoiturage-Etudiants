import { pgTable, integer, date } from "drizzle-orm/pg-core";
import { UsersTable } from "./auth-profiles/user.js";
import { TrajetTable } from "./trajets.js";


export const ReservationTable = pgTable("reservations", {

    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    id_passager: integer("id_passager").references(() => UsersTable.id),
    id_trajet: integer("id_trajet").references(()=> TrajetTable.id),
    dateReservation: date("dateReservation"),

});