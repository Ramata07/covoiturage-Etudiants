import { PublicUser, UsersTable } from "@/db/schema/auth-profiles/user";
import { userRoles } from "@/db/schema/enums/enums";
import { authenticated} from "@/middlewares/authenticated";
import { getUserProfile } from "@/middlewares/get-user-profile";
import { validateRequest } from "@/middlewares/validate-request";
import { ApiResponse, successResponse, errorResponse } from "@/utils/api-response";
import { Router, type Request, type Response } from "express";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import bcrypt from "bcrypt";
import { createAccessToken } from "@/utils/access-token";
import { createRefreshToken, revokeRefreshToken, verifyRefreshToken } from "@/utils/refresh-token";
import { createOtp, verifyOtp } from "@/utils/otp";
import { HttpError } from "@/errors/http-error";
import { generateUid } from "@/utils/generate_uid";


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

    if (!user.email_verifie) {
      throw new HttpError(403, "Compte non vérifié, veuillez vérifier votre code OTP");
    }

    const accessToken = createAccessToken(user);
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
    res: Response<ApiResponse<{ email: string; message: string; otp: string }>>,
  ) => {
    const { nom, prenom, email, mot_de_passe, role, photo } = req.body;

    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
    if (existingUser.length > 0) {
      return res.status(409).json(errorResponse("Email déjà utilisé"));
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 15);

    const id = generateUid("usr_");

    await db.insert(UsersTable)
      .values({ id, nom, prenom, email, mot_de_passe: hashedPassword, role, photo });

    const otp = await createOtp(id); //en intégrant ça, ça permet de connaitre direct le code OTP sans vérif donc en production faudra modifier, pareil pour resend-otp 

    res.json(successResponse({
      email,
      message: "Compte créé. Vérifiez votre code OTP pour l'activer.",
      otp, 
    }));
  },
);
//

// VERIFY OTP
const verifyOtpSchema = z.object({
  email: z.email(),
  code: z.string().length(6),
});

type VerifyOtpBody = z.infer<typeof verifyOtpSchema>;

authRoutes.post(
  "/verify-otp",
  validateRequest({ body: verifyOtpSchema }),
  async (
    req: Request<{}, {}, VerifyOtpBody>,
    res: Response<ApiResponse<{ accessToken: string; refreshToken: string }>>,
  ) => {
    const { email, code } = req.body;

    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
    if (existingUser.length === 0) {
      return res.status(404).json(errorResponse("Utilisateur non trouvé"));
    }

    const user = existingUser[0]!;
    if (user.email_verifie) {
      throw new HttpError(409, "Compte déjà vérifié");
    }

    await verifyOtp(user.id, code);

    await db.update(UsersTable).set({ email_verifie: true }).where(eq(UsersTable.id, user.id));

    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);

    res.json(successResponse({ accessToken, refreshToken }));
  },
);
//

// RESEND OTP
const resendOtpSchema = z.object({
  email: z.email(),
});

type ResendOtpBody = z.infer<typeof resendOtpSchema>;

authRoutes.post(
  "/resend-otp",
  validateRequest({ body: resendOtpSchema }),
  async (
    req: Request<{}, {}, ResendOtpBody>,
    res: Response<ApiResponse<{ message: string; otp: string }>>,
  ) => {
    const { email } = req.body;

    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
    if (existingUser.length === 0) {
      return res.status(404).json(errorResponse("Utilisateur non trouvé"));
    }

    const user = existingUser[0]!;
    if (user.email_verifie) {
      throw new HttpError(409, "Compte déjà vérifié");
    }

    const otp = await createOtp(user.id);

    res.json(successResponse({
      message: "Nouveau code OTP généré.",
      otp, 
    }));
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

    const accessToken = createAccessToken(user);
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

