import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["passager", "conducteur"]);
export const statutEnum = pgEnum("statut", ["prevu", "en_cours", "termine", "annule"]);