"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hostelSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    address: {
        type: String,
        trim: true,
    },
    capacity: {
        type: Number,
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
hostelSchema.index({ code: 1 });
hostelSchema.index({ isActive: 1 });
hostelSchema.index({ code: 1, isActive: 1 });
exports.default = mongoose_1.default.model("Hostel", hostelSchema);
