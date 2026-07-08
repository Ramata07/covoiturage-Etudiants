import type { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import env from "@/config/env";
import { HttpError } from "@/errors/http-error";
import type { UserRoles } from "@/db/schema/enums/enums";

export type AuthPayload = {
  id: string;
  role: UserRoles;
};

export const authenticated: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    next(new HttpError(401, "Token manquant"));
    return;
  }

  try {
    req.auth = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    next();
  } catch {
    next(new HttpError(401, "Token invalide"));
  }
};
