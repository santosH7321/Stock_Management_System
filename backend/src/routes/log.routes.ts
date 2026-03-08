import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin, isAdminOrGuard } from "../middlewares/role.middleware";
import { getLogs } from "../controllers/log.controller";

const router = Router();

router.get("/", protect, isAdminOrGuard, getLogs);

export default router;