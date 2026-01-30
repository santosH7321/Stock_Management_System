import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getItems } from "../controllers/item.controller";

const router = Router();

router.get("/", protect, getItems);

export default router;
