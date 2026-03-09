"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockLogSchema = new mongoose_1.default.Schema({
    itemId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    hostelId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Hostel",
        required: true,
    },
    changedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "GUARD"],
        required: true,
    },
    action: {
        type: String,
        enum: ["INCREASE", "DECREASE"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    beforeQty: {
        type: Number,
        required: true,
        min: 0,
    },
    afterQty: {
        type: Number,
        required: true,
        min: 0,
    },
    remark: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, {
    timestamps: true,
    versionKey: false,
});
stockLogSchema.index({ hostelId: 1, createdAt: -1 });
stockLogSchema.index({ itemId: 1, createdAt: -1 });
stockLogSchema.index({ changedBy: 1, createdAt: -1 });
exports.default = mongoose_1.default.model("StockLog", stockLogSchema);
