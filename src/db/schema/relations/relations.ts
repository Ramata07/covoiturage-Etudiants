import { relations } from "drizzle-orm";
import { UsersTable, RefreshTokenTable, OtpTable } from "../auth-profiles";
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
  // Un user peut avoir 0 ou plusieurs refresh tokens (multi-appareils)
  refreshTokens: many(RefreshTokenTable),
  // Un user peut avoir 0 ou plusieurs codes OTP (historique)
  otps: many(OtpTable),

}));

// Un refresh token appartient à un user
export const refreshTokenRelations = relations(RefreshTokenTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [RefreshTokenTable.id_user],
    references: [UsersTable.id],
  }),
}));

// Un OTP appartient à un user
export const otpRelations = relations(OtpTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [OtpTable.id_user],
    references: [UsersTable.id],
  }),
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