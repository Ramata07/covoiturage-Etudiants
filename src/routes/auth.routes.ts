import { PublicUser } from "@/db/schema/auth-profiles/user";
import { validateRequest } from "@/middlewares/validate-request";
import { ApiResponse, successResponse } from "@/utils/api-response";
import { Router, type Request, type Response } from "express";
import z from "zod";

export const authRoutes = Router();

/**
 * TODO:
 * - Implementer tous les endpoints
 * - Implémenter une logique basique de JWT token pour l'authentification
 */

authRoutes.get(
  "/me",
  async (_req, res: Response<ApiResponse<PublicUser>>) => {},
);

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
    res: Response<ApiResponse<{ email: string; password: string }>>,
  ) => {
    const { email, password } = req.body;

    res.json(successResponse({ email, password }));
  },
);

authRoutes.post("/register", async (_req, res) => {});

// authRoutes.post("/forgot-password", async (_req, res) => {});

authRoutes.post("/reset-password", async (_req, res) => {});
