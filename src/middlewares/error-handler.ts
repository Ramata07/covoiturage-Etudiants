import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "@/errors/http-error";
import { logger } from "@/middlewares/logger";
import { errorResponse } from "@/utils/api-response";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, 'Route ${req.method} ${req.originalUrl} not found'));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isHttpError = err instanceof HttpError;
  const statusCode = isHttpError ? err.statusCode : 500;
  const message = isHttpError ? err.message : "Internal server error";

  if (statusCode >= 500) {
    logger.error({ err }, message);
  }

  res.status(statusCode).json(errorResponse(message));
};