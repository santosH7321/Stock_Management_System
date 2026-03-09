"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ["ADMIN", "GUARD"],
        required: true,
    },
    hostelId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Hostel",
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.password = undefined;
            return ret;
        }
    },
    toObject: {
        transform: (_doc, ret) => {
            ret.password = undefined;
            return ret;
        }
    }
});
userSchema.index({ hostelId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ hostelId: 1, role: 1, isActive: 1 });
exports.default = mongoose_1.default.model("User", userSchema);
