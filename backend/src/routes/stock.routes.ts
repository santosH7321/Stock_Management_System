import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdminOrGuard } from "../middlewares/role.middleware";
import { updateStock } from "../controllers/stock.controller";

const router = Router();

router.patch("/:itemId", protect, isAdminOrGuard, updateStock);

export default router;