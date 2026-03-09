"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = void 0;
const StockLog_model_1 = __importDefault(require("../models/StockLog.model"));
const getLogs = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.user.role === "GUARD") {
            filter.hostelId = req.user.hostelId;
        }
        else {
            if (req.query.hostelId) {
                filter.hostelId = req.query.hostelId;
            }
        }
        if (req.query.userId) {
            filter.changedBy = req.query.userId;
        }
        if (req.query.action && ["INCREASE", "DECREASE"].includes(req.query.action)) {
            filter.action = req.query.action;
        }
        if (req.query.itemId) {
            filter.itemId = req.query.itemId;
        }
        const { startDate, endDate } = req.query;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: "Invalid date format" });
            }
            if (start > end) {
                return res.status(400).json({ message: "startDate cannot be after endDate" });
            }
            end.setHours(23, 59, 59, 999);
            filter.createdAt = { $gte: start, $lte: end };
        }
        const [logs, total] = await Promise.all([
            StockLog_model_1.default.find(filter)
                .populate("itemId", "itemName unit")
                .populate("hostelId", "name code")
                .populate("changedBy", "name role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            StockLog_model_1.default.countDocuments(filter)
        ]);
        return res.status(200).json({
            success: true,
            page,
            pages: Math.ceil(total / limit),
            total,
            data: logs
        });
    }
    catch (error) {
        console.error("GetLogs error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getLogs = getLogs;
