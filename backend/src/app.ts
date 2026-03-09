import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import itemRoutes from "./routes/item.routes";
import stockRoutes from "./routes/stock.routes";
import logRoutes from "./routes/log.routes";
import helmet from "helmet";
import { globalLimiter } from "./middlewares/rateLimit.middleware";

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

const configuredOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_ORIGIN,
  process.env.PROD_URL,
]
  .filter(Boolean)
  .flatMap((value) => value!.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS: origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/logs", logRoutes);

export default app;
