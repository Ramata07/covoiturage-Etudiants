import { healthRoutes } from "@/routes/health.routes";
import { Router } from "express";
import { authRoutes } from "./auth.routes";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);
