"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const stock_routes_1 = __importDefault(require("./routes/stock.routes"));
const log_routes_1 = __importDefault(require("./routes/log.routes"));
const helmet_1 = __importDefault(require("helmet"));
const rateLimit_middleware_1 = require("./middlewares/rateLimit.middleware");
const app = (0, express_1.default)();
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
    .flatMap((value) => value.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("CORS: origin not allowed"));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(rateLimit_middleware_1.globalLimiter);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/items", item_routes_1.default);
app.use("/api/stock", stock_routes_1.default);
app.use("/api/logs", log_routes_1.default);
exports.default = app;
