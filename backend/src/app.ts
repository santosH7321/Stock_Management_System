import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import itemRoutes from "./routes/item.routes";
import stockRoutes from "./routes/stock.routes";
import logRoutes from "./routes/log.routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";



const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/logs", logRoutes);


export default app;
