import rateLimit from "express-rate-limit";
import env from "@/config/env";
import { errorResponse } from "@/utils/api-response";

export const rateLimitMiddleware = rateLimit({
  legacyHeaders: false,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  handler: (_req, res) => {
    res
      .status(429)
      .json(errorResponse("Too many requests. Please try again later."));
  },
});