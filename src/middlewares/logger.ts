import type { RequestHandler } from "express";
import pino, { type LoggerOptions } from "pino";

const isProduction = process.env.NODE_ENV === "production";

const loggerOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      },
};

export const logger = pino(loggerOptions);

export const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info(
      {
        duration_ms: Date.now() - startedAt,
        method: req.method,
        status_code: res.statusCode,
        url: req.originalUrl,
      },
      "request completed",
    );
  });

  next();
};