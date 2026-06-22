import { relations } from "drizzle-orm";
import { UsersTable } from "./auth-profiles/user";
import { VehiculeTable } from "./vehicules";

export const vehicleRelations = relations(VehiculeTable, ({ many, one }) => ({
  user: one(UsersTable, {
    fields: [VehiculeTable.proprio],
    references: [UsersTable.id],
  }),
}));

export const userRelations = relations(UsersTable, ({ many, one }) => ({
  vehicules: many(VehiculeTable),
}));
