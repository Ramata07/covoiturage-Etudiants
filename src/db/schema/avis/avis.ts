import { pgTable, varchar, integer} from "drizzle-orm/pg-core";
import { UsersTable } from "../auth-profiles";
import { TrajetTable } from "../trajet";
import { updatedAt, createdAt } from "@/db/schema-helpers.js";

export const AvisTable = pgTable("avis", {

    id: varchar("id", { length: 100 }).primaryKey(),
    id_passager: varchar("id_passager", { length: 150 }).references(() => UsersTable.id),
    id_trajet: varchar("id_trajet", { length: 100 }).references(() => TrajetTable.id),
    nbreEtoiles: integer("nbreEtoiles"),
    commentaire: varchar("commentaire", {length: 300}).notNull(),
    created_At: createdAt(),
    updated_At: updatedAt(),
});