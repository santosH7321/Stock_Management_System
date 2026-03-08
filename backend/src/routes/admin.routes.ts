import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import {
  // Hostel
  createHostel,
  updateHostel,
  getHostels,
  toggleHostelStatus,
  // Guard
  createGuard,
  getGuards,
  toggleGuardStatus,
  // Item
  createItem,
  updateItem,
  toggleItemStatus,
  // Dashboard
  getDashboardStats
} from "../controllers/admin.controller";

const router = Router();

router.use(protect, isAdmin);

// HOSTEL ROUTES
router.get("/hostels", getHostels);
router.post("/hostels", createHostel);
router.patch("/hostels/:id", updateHostel);
router.patch("/hostels/:id/toggle", toggleHostelStatus);

// GUARD ROUTES
router.get("/guards", getGuards);
router.post("/guards", createGuard);
router.patch("/guards/:id/toggle", toggleGuardStatus);

// ITEM ROUTES
router.post("/items", createItem);
router.patch("/items/:id", updateItem);
router.patch("/items/:id/toggle", toggleItemStatus);

// DASHBOARD
router.get("/stats", getDashboardStats);

export default router;