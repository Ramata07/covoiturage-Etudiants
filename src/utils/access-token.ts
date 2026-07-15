import jwt from "jsonwebtoken";
import env from "@/config/env";
import type { UserRoles } from "@/db/schema/enums/enums";

export const JWT_ISSUER = "covoiturage-etudiants-api";

export function createAccessToken(user: { id: string; role: UserRoles }) {
  return jwt.sign(
    { role: user.role, scope: user.role },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
      issuer: JWT_ISSUER,
      subject: user.id,
    },
  );
}
