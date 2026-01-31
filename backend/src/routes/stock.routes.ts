import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { updateStock } from "../controllers/stock.controller";

const router = Router();

router.patch("/:itemId", protect, updateStock);

export default router;
