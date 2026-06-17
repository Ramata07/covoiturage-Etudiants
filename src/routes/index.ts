import { healthRoutes } from "@/routes/health.routes";
import { Router } from "express";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);