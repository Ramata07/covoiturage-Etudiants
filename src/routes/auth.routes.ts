import env from "@/config/env";
import { PublicUser, UsersTable } from "@/db/schema/auth-profiles/user";
import { userRoles } from "@/db/schema/enums/enums";
import { authenticated } from "@/middlewares/authenticated";
import { getUserProfile } from "@/middlewares/get-user-profile";
import { validateRequest } from "@/middlewares/validate-request";
import { ApiResponse, successResponse, errorResponse } from "@/utils/api-response";
import { Router, type Request, type Response } from "express";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { createRefreshToken, revokeRefreshToken, verifyRefreshToken } from "@/utils/refresh-token";
import { HttpError } from "@/errors/http-error";


/**
 * TODO:
 * - Implementer tous les endpoints
 * - Implémenter une logique basique de JWT token pour l'authentification
 */


export const authRoutes = Router();

// ME
authRoutes.get(
  "/me",
  authenticated,
  getUserProfile,
  async (req: Request, res: Response<ApiResponse<PublicUser>>) => {
    res.json(successResponse(req.user!));
  },
);


// LOGIN
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(2),
});

type LoginBody = z.infer<typeof loginSchema>;

authRoutes.post(
  "/login",
  validateRequest({ body: loginSchema }),
  async (
    req: Request<{}, {}, LoginBody>,
    res: Response<ApiResponse<{ email: string; accessToken: string; refreshToken: string }>>,
  ) => {
    const { email, password } = req.body;

    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
    if (existingUser.length === 0) {
      return res.status(404).json(errorResponse("Email non trouvé"));
    }

    const user = existingUser[0]!;
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse("Mot de passe incorrect"));
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = await createRefreshToken(user.id);

    res.json(successResponse({ email, accessToken, refreshToken }));
  },

);
//

// REGISTER
const registerSchema = z.object({
  nom: z.string(),
  prenom: z.string(),
  email: z.email(),
  mot_de_passe: z.string().min(2),
  role: z.enum(userRoles),
  photo: z.string(),
});

type RegisterBody = z.infer<typeof registerSchema>;

authRoutes.post(
  "/register",
  validateRequest({ body: registerSchema }),
  async (
    req: Request<{}, {}, RegisterBody>,
    res: Response<ApiResponse<PublicUser & { accessToken: string; refreshToken: string }>>,
  ) => {
    const { nom, prenom, email, mot_de_passe, role, photo } = req.body;

    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
    if (existingUser.length > 0) {
      return res.status(409).json(errorResponse("Email déjà utilisé"));
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 15);

    const id = randomUUID();

    const newUser = await db.insert(UsersTable)
      .values({ id, nom, prenom, email, mot_de_passe: hashedPassword, role, photo })
      .returning();

    const accessToken = jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = await createRefreshToken(id);

    const { created_At, updated_At } = newUser[0]!;
    res.json(successResponse({ id, nom, prenom, email, role, photo, created_At, updated_At, accessToken, refreshToken }));
  },
);
//

// REFRESH TOKEN
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

type RefreshTokenBody = z.infer<typeof refreshTokenSchema>;

authRoutes.post(
  "/refresh-token",
  validateRequest({ body: refreshTokenSchema }),
  async (
    req: Request<{}, {}, RefreshTokenBody>,
    res: Response<ApiResponse<{ accessToken: string; refreshToken: string }>>,
  ) => {
    const { refreshToken } = req.body;

    const stored = await verifyRefreshToken(refreshToken);

    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.id, stored.id_user));
    const user = existingUser[0];
    if (!user) {
      throw new HttpError(404, "Utilisateur non trouvé");
    }

    // Rotation
    await revokeRefreshToken(stored.id);

    const accessToken = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = await createRefreshToken(user.id);

    res.json(successResponse({ accessToken, refreshToken: newRefreshToken }));
  },
);
//

// RESET PASSWORD

const reset_password_schema = z.object({
  password: z.string().min(6),
  new_password: z.string(),
});

type ResetPasswordBody = z.infer<typeof reset_password_schema>;

authRoutes.post("/reset-password",
  authenticated,
  validateRequest({ body: reset_password_schema }),
  async (req:Request<{},{},ResetPasswordBody>,
         res: Response<ApiResponse<{ message: string }>>
        ) => {
        const { password, new_password } = req.body;

    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.id, req.auth!.id));

    if (existingUser.length === 0) {
      return res.status(404).json(errorResponse("Utilisateur non trouvé"));
    }

    const user = existingUser[0]!;

    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);

    if (!isPasswordValid) {
    return res.status(401).json(errorResponse("Mot de passe incorrect"));

};

const hashedNewPassword = await bcrypt.hash(new_password, 15);

await db.update(UsersTable).set({mot_de_passe: hashedNewPassword}).where(eq(UsersTable.id, user.id));

res.json(successResponse({ message: "Mot de passe mis à jour avec succès" }));

});
