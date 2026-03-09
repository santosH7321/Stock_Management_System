"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const itemSchema = new mongoose_1.default.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true,
    },
    hostelId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Hostel",
        required: true,
    },
    unit: {
        type: String,
        enum: ["KG", "LITRE", "PIECE", "PACKET", "BOX"],
        required: true,
    },
    totalQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    availableQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    minThreshold: {
        type: Number,
        default: 5,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
itemSchema.index({
    itemName: 1,
    hostelId: 1
}, {
    unique: true
});
itemSchema.index({
    hostelId: 1,
    isActive: 1
});
itemSchema.index({
    hostelId: 1,
    availableQuantity: 1
});
exports.default = mongoose_1.default.model("Item", itemSchema);
