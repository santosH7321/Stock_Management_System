"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrGuard = exports.isGuard = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getTokenFromCookieHeader = (cookieHeader) => {
    if (!cookieHeader)
        return null;
    const tokenCookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("token="));
    if (!tokenCookie)
        return null;
    return decodeURIComponent(tokenCookie.slice("token=".length));
};
exports.protect = ((req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server configuration error" });
        }
        const authHeaderToken = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null;
        const token = getTokenFromCookieHeader(req.headers.cookie) || authHeaderToken;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Not authorized, token invalid" });
    }
});
exports.isGuard = ((req, res, next) => {
    if (!req.user || req.user.role !== "GUARD") {
        return res.status(403).json({ message: "Guard access only" });
    }
    next();
});
exports.isAdminOrGuard = ((req, res, next) => {
    if (!req.user || !["ADMIN", "GUARD"].includes(req.user.role)) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
});
