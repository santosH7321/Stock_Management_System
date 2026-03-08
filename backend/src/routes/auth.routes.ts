import { Router } from "express";
import { login, logout, getMe } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post("/login", authLimiter, login);

router.post("/logout", protect, logout);

router.get("/me", protect, getMe);

export default router;