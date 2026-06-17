import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const UsersTable = pgTable("users", {

    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    nom: varchar("nom", { length: 200 }).notNull(),
    prenom: varchar("prenom", { length: 150 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 150 }).notNull(),
    role: varchar("role", { length: 15 }).notNull(),
    //photo: 
    created_At: timestamp("created_at").notNull(),
    updated_At: timestamp("update_at").notNull(),

});











