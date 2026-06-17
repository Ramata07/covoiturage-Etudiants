import { pgTable, varchar, integer} from "drizzle-orm/pg-core";
import { UsersTable } from "./auth-profiles/user.js";

export const AvisTable = pgTable("avis", {

    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    id_passager: integer("id_passager").references(() => UsersTable.id),
    nbreEtoiles: integer("nbreEtoiles"),
    commentaire: varchar("commentaire", {length: 300}).notNull(),
    
});