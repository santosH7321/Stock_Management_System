"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStock = void 0;
const Item_model_1 = __importDefault(require("../models/Item.model"));
const StockLog_model_1 = __importDefault(require("../models/StockLog.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const updateStock = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { itemId } = req.params;
        const { action, quantity, remark } = req.body;
        if (!action || quantity === undefined) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Action and quantity are required" });
        }
        const allowedActions = ["INCREASE", "DECREASE"];
        if (!allowedActions.includes(action)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Action must be INCREASE or DECREASE" });
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }
        const item = await Item_model_1.default.findOne({ _id: itemId, isActive: true }).session(session);
        if (!item) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Item not found" });
        }
        if (req.user.role === "GUARD" &&
            item.hostelId.toString() !== req.user.hostelId?.toString()) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Unauthorized hostel access" });
        }
        const beforeQty = item.availableQuantity;
        if (action === "DECREASE" && beforeQty < quantity) {
            await session.abortTransaction();
            return res.status(400).json({
                message: `Insufficient stock. Available: ${beforeQty}`
            });
        }
        if (action === "INCREASE") {
            item.availableQuantity += quantity;
            if (req.user.role === "ADMIN") {
                item.totalQuantity += quantity;
            }
        }
        else {
            item.availableQuantity -= quantity;
        }
        const afterQty = item.availableQuantity;
        await item.save({ session });
        await StockLog_model_1.default.create([{
                itemId: item._id,
                hostelId: item.hostelId,
                changedBy: req.user.id,
                role: req.user.role,
                action,
                quantity,
                beforeQty,
                afterQty,
                remark: remark?.trim() || ""
            }], { session });
        await session.commitTransaction();
        return res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: {
                itemId: item._id,
                itemName: item.itemName,
                beforeQty,
                afterQty,
                action,
                quantity
            }
        });
    }
    catch (error) {
        await session.abortTransaction();
        console.error("UpdateStock error:", error);
        return res.status(500).json({ message: "Server error" });
    }
    finally {
        session.endSession();
    }
};
exports.updateStock = updateStock;
