"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Server error";
    if (statusCode >= 500) {
        console.error(`[${req.method}] ${req.path} — ${message}`, err);
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });
    }
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }
    return res.status(statusCode).json({
        success: false,
        message
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
};
exports.notFound = notFound;
