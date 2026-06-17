import { client } from "../db";
// import redis from "../redis";
import { successResponse, type ApiResponse } from "../utils/api-response";
import { Router, type Response } from "express";

type DependencyStatus = "up" | "down";

type DependencyHealth = {
  message?: string;
  status: DependencyStatus;
};

type HealthData = {
  dependencies: {
    database: DependencyHealth;
    // redis: DependencyHealth;
  };
  status: "ok" | "degraded";
  uptime: number;
};

export const healthRoutes = Router();

healthRoutes.get("/", async (_req, res: Response<ApiResponse<HealthData>>) => {
  const [database] = await Promise.all([
    checkDatabaseHealth(),
    // checkRedisHealth(),
  ]);
  //   const isHealthy = database.status === "up" && redisHealth.status === "up";

  const isHealthy = database.status === "up";

  res.status(isHealthy ? 200 : 503).json(
    successResponse<HealthData>({
      dependencies: {
        database,
        // redis: redisHealth,
      },
      status: isHealthy ? "ok" : "degraded",
      uptime: process.uptime(),
    }),
  );
});

const checkDatabaseHealth = async (): Promise<DependencyHealth> => {
  try {
    await client`select 1`;

    return { status: "up" };
  } catch (error) {
    return {
      message: getErrorMessage(error),
      status: "down",
    };
  }
};

// const checkRedisHealth = async (): Promise<DependencyHealth> => {
//   try {
//     if (redis.status === "wait" || redis.status === "end") {
//       await redis.connect();
//     }

//     const response = await redis.ping();

//     return {
//       status: response === "PONG" ? "up" : "down",
//     };
//   } catch (error) {
//     return {
//       message: getErrorMessage(error),
//       status: "down",
//     };
//   }
// };

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unavailable";