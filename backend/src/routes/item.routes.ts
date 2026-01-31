import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getItems, getLowStockItems } from "../controllers/item.controller";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

router.get("/", protect, getItems);
router.get("/low-stock", protect, isAdmin, getLowStockItems);


export default router;
