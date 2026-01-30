import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import { createHostel, createGuard } from "../controllers/admin.controller";

const router = Router();

router.post("/hostel", protect, isAdmin, createHostel);
router.post("/guard", protect, isAdmin, createGuard);

export default router;
