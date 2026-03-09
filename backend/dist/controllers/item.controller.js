"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockItems = exports.getItemById = exports.getItems = void 0;
const Item_model_1 = __importDefault(require("../models/Item.model"));
const getItems = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 100);
        const search = req.query.search?.trim();
        const allowedSortFields = ["createdAt", "itemName", "availableQuantity", "totalQuantity"];
        const sort = allowedSortFields.includes(req.query.sort)
            ? req.query.sort
            : "createdAt";
        const skip = (page - 1) * limit;
        let filter = { isActive: true };
        if (req.user.role === "GUARD") {
            filter.hostelId = req.user.hostelId;
        }
        if (req.user.role === "ADMIN" && req.query.hostelId) {
            filter.hostelId = req.query.hostelId;
        }
        if (search) {
            filter.itemName = { $regex: search, $options: "i" };
        }
        const [items, total] = await Promise.all([
            Item_model_1.default.find(filter)
                .populate("hostelId", "name code")
                .sort({ [sort]: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Item_model_1.default.countDocuments(filter)
        ]);
        return res.status(200).json({
            success: true,
            page,
            pages: Math.ceil(total / limit),
            total,
            data: items
        });
    }
    catch (error) {
        console.error("GetItems error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getItems = getItems;
const getItemById = async (req, res) => {
    try {
        const item = await Item_model_1.default.findById(req.params.id)
            .populate("hostelId", "name code")
            .lean();
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        if (req.user.role === "GUARD" &&
            item.hostelId.toString() !== req.user.hostelId?.toString()) {
            return res.status(403).json({ message: "Unauthorized hostel access" });
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        console.error("GetItemById error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getItemById = getItemById;
const getLowStockItems = async (req, res) => {
    try {
        let filter = {
            isActive: true,
            $expr: { $lte: ["$availableQuantity", "$minThreshold"] }
        };
        if (req.user.role === "GUARD") {
            filter.hostelId = req.user.hostelId;
        }
        if (req.user.role === "ADMIN" && req.query.hostelId) {
            filter.hostelId = req.query.hostelId;
        }
        const items = await Item_model_1.default.find(filter)
            .populate("hostelId", "name code")
            .sort({ availableQuantity: 1 })
            .lean();
        return res.status(200).json({
            success: true,
            total: items.length,
            data: items
        });
    }
    catch (error) {
        console.error("GetLowStockItems error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getLowStockItems = getLowStockItems;
