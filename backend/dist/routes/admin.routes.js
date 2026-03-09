"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect, role_middleware_1.isAdmin);
// HOSTEL ROUTES
router.get("/hostels", admin_controller_1.getHostels);
router.post("/hostels", admin_controller_1.createHostel);
router.patch("/hostels/:id", admin_controller_1.updateHostel);
router.patch("/hostels/:id/toggle", admin_controller_1.toggleHostelStatus);
// GUARD ROUTES
router.get("/guards", admin_controller_1.getGuards);
router.post("/guards", admin_controller_1.createGuard);
router.patch("/guards/:id/toggle", admin_controller_1.toggleGuardStatus);
// ITEM ROUTES
router.post("/items", admin_controller_1.createItem);
router.patch("/items/:id", admin_controller_1.updateItem);
router.patch("/items/:id/toggle", admin_controller_1.toggleItemStatus);
// DASHBOARD
router.get("/stats", admin_controller_1.getDashboardStats);
exports.default = router;
