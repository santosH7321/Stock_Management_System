import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import { getLogs } from "../controllers/log.controller";

const router = Router();

router.get("/", protect, isAdmin, getLogs);

export default router;
