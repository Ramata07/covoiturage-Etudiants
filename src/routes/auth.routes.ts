import { PublicUser, UsersTable } from "@/db/schema/auth-profiles/user";
import { userRoles } from "@/db/schema/enums/enums";
import { validateRequest } from "@/middlewares/validate-request";
import { ApiResponse, successResponse, errorResponse } from "@/utils/api-response";
import { Router, type Request, type Response } from "express";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export const authRoutes = Router();

// ME
authRoutes.get(
  "/me",
  async (req, res: Response<ApiResponse<PublicUser>>) => {

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
    return res.status(401).json(errorResponse("Token manquant"));
}

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET!);
} catch {
    return res.status(401).json(errorResponse("Token invalide"));
}

const tokenData = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.id, tokenData.id));
    if (existingUser.length === 0) {
      return res.status(404).json(errorResponse("Utilisateur non trouvé"));
    }

    const user = existingUser[0]!;
    const { mot_de_passe, ...publicUser } = user;
    res.json(successResponse(publicUser));
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
    res: Response<ApiResponse<{ email: string; token: string }>>,
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

     const token = jwt.sign({id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });

      res.json(successResponse({ email, token }));
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
    res: Response<ApiResponse<PublicUser>>,
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

    const token = jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    const { created_At, updated_At } = newUser[0]!;
     res.json(successResponse({ id, nom, prenom, email, role, photo, created_At, updated_At, token }));
  },
);
//

// RESET PASSWORD
authRoutes.post("/reset-password", async (_req, res) => {});
