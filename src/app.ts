import cors from "cors"
import express  from "express"
import { request } from "node:http";
import { requestLogger } from "./middlewares/logger";
import { rateLimitMiddleware } from "./middlewares/rate-limit";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { apiRoutes } from "./routes";

export const app = express()

//Middlewares
app.use(cors({}));
app.use(express.json());
app.use(requestLogger);
//app.use(rateLimitMiddleware);

//Routes
app.use("/v1", apiRoutes);


//Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);
