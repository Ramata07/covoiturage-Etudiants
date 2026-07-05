import { relations } from "drizzle-orm";
import { UsersTable } from "../auth-profiles";
import { VehiculeTable } from "../vehicule";
import { ReservationTable } from "../reservation";
import { TrajetTable } from "../trajet";
import { AvisTable } from "../avis";


export const usersRelations = relations(UsersTable, ({ many }) => ({

  // Un user possède 0 ou un véhicule
  vehicules: many(VehiculeTable),
  // Un user peut faire 0 ou plusieurs réservations
  reservations: many(ReservationTable),
  // Un user crée 0 ou plusieurs trajets
  trajets: many(TrajetTable),
  // Un user peut avoir 0 ou plusieurs avis
  avis: many(AvisTable),

}));


export const vehiculeRelations = relations(VehiculeTable, ({ many }) =>({

  // Un véhicule peut avoir 0 ou plusieurs réservations
  reservations: many(ReservationTable)

}));


export const trajetRelations = relations(TrajetTable, ({ one, many }) =>({

  // Un trajet appartient à un conducteur 
  conducteur: one(UsersTable, {
    fields: [TrajetTable.id_conducteur],
    references: [UsersTable.id]
  }),

  // Et un véhicule
  vehicule: one(VehiculeTable, {
    fields: [TrajetTable.id_vehicule],
    references: [VehiculeTable.id]
  }),

  // Un trajet peut avoir 0 ou plusieurs réservations
  reservations: many(ReservationTable),

  // Un trajet peut avoir 0 ou plusieurs avis
  avis: many(AvisTable),
}));

// Une réservation appartient à un passager 
export const reservationsRelations = relations(ReservationTable, ({ one }) => ({
    passager: one(UsersTable, {
        fields:     [ReservationTable.id_passager],
        references: [UsersTable.id],
    }),

    // Et à un trajet
    trajet:   one(TrajetTable, {
        fields:     [ReservationTable.id_trajet],
        references: [TrajetTable.id],
    }),
}));

// Un avis appartient à un passager
export const avisRelations = relations(AvisTable, ({ one }) => ({
    passager: one(UsersTable, {
        fields:     [AvisTable.id_passager],
        references: [UsersTable.id],
    }),

    // Et à un trajet
    trajet:   one(TrajetTable, {
        fields:     [AvisTable.id_trajet],
        references: [TrajetTable.id],
    }),

}));