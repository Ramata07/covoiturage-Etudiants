import { pgEnum } from "drizzle-orm/pg-core";

export const userRoles = ["admin", "client", "chauffeur"] as const; // readonly table
export type UserRoles = (typeof userRoles)[number]; // typescript type
export const userRolesEnum = pgEnum("userRoles", userRoles); // pg enum
