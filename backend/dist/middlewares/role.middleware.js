"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrGuard = exports.isGuard = exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};
exports.isAdmin = isAdmin;
const isGuard = (req, res, next) => {
    if (!req.user || req.user.role !== "GUARD") {
        return res.status(403).json({ message: "Guard access only" });
    }
    next();
};
exports.isGuard = isGuard;
const isAdminOrGuard = (req, res, next) => {
    if (!req.user || !["ADMIN", "GUARD"].includes(req.user.role)) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
};
exports.isAdminOrGuard = isAdminOrGuard;
