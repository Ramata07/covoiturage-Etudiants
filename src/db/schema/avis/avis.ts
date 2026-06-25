import { pgTable, varchar, integer} from "drizzle-orm/pg-core";
import { UsersTable } from "../auth-profiles/user.js";
import { updatedAt, createdAt } from "@/db/schema-helpers.js";

export const AvisTable = pgTable("avis", {

    id: varchar("id", { length: 100 }).notNull(),
    id_passager: integer("id_passager").references(() => UsersTable.id),
    nbreEtoiles: integer("nbreEtoiles"),
    commentaire: varchar("commentaire", {length: 300}).notNull(),
    

    created_At: createdAt(),
    updated_At: updatedAt(),
});