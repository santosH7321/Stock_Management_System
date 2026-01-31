import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getItems, getLowStockItems } from "../controllers/item.controller";

const router = Router();

router.get("/", protect, getItems);
router.get("/low-stock", protect, getLowStockItems);


export default router;
