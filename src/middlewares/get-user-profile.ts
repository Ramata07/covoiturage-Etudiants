import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import db from "@/db";
import { UsersTable } from "@/db/schema/auth-profiles/user";
import { HttpError } from "@/errors/http-error";

export const getUserProfile: RequestHandler = async (req, _res, next) => {
  const existingUser = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.id, req.auth!.id));

  if (existingUser.length === 0) {
    next(new HttpError(404, "Utilisateur non trouvé"));
    return;
  }

  const { mot_de_passe, ...publicUser } = existingUser[0]!;
  req.user = publicUser;
  next();
};
