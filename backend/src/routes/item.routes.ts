import { Router, RequestHandler } from "express";
import { protect, isAdminOrGuard } from "../middlewares/auth.middleware";
import {
  getItems,
  getItemById,
  getLowStockItems
} from "../controllers/item.controller";

const router = Router();

router.get("/", protect, isAdminOrGuard, getItems);
router.get("/low-stock", protect, isAdminOrGuard, getLowStockItems);
router.get("/:id", protect, isAdminOrGuard, getItemById);

export default router;