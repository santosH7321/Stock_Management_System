import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import { createHostel, createGuard, createItem } from "../controllers/admin.controller";

const router = Router();

router.post("/hostel", protect, isAdmin, createHostel);
router.post("/guard", protect, isAdmin, createGuard);
router.post("/item", protect, isAdmin, createItem);

export default router;
