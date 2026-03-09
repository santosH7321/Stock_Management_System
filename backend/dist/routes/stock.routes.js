"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const stock_controller_1 = require("../controllers/stock.controller");
const router = (0, express_1.Router)();
router.patch("/:itemId", auth_middleware_1.protect, role_middleware_1.isAdminOrGuard, stock_controller_1.updateStock);
exports.default = router;
