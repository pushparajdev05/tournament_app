import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import requestLogger from "./middlewares/requestLogger";
import rateLimiter from "./middlewares/rateLimiter";
import errorHandler from "./middlewares/error_handlers/error.middleware";
import authRoutes from "./routes/auth.routes";
import { env } from "./config/envConfig";

const cookieParser = require("cookie-parser");
const compression = require("compression");

    
const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(rateLimiter);

// Http Request - Response cycle logging
app.use(requestLogger);

// Error handlers
app.use(errorHandler);

app.use("/api/auth", authRoutes);

export { app, logger };
