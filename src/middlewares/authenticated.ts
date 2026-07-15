import type { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import env from "@/config/env";
import { HttpError } from "@/errors/http-error";
import type { UserRoles } from "@/db/schema/enums/enums";
import { JWT_ISSUER } from "@/utils/access-token";

export type AuthPayload = {
  id: string;
  role: UserRoles;
  scope: string;
};

export const authenticated: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    next(new HttpError(401, "Token manquant"));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { issuer: JWT_ISSUER }) as jwt.JwtPayload;
    req.auth = { id: decoded.sub!, role: decoded.role as UserRoles, scope: decoded.scope as string };
    next();
  } catch {
    next(new HttpError(401, "Token invalide"));
  }
};
