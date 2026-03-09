"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.toggleItemStatus = exports.updateItem = exports.createItem = exports.toggleGuardStatus = exports.getGuards = exports.createGuard = exports.getHostels = exports.toggleHostelStatus = exports.updateHostel = exports.createHostel = void 0;
const Hostel_model_1 = __importDefault(require("../models/Hostel.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Item_model_1 = __importDefault(require("../models/Item.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const StockLog_model_1 = __importDefault(require("../models/StockLog.model"));
// HOSTEL CONTROLLERS
const createHostel = async (req, res) => {
    try {
        const { name, code, address, capacity } = req.body;
        if (!name || !code) {
            return res.status(400).json({ message: "Name and code are required" });
        }
        const exists = await Hostel_model_1.default.findOne({
            $or: [
                { name: name.trim() },
                { code: code.trim().toUpperCase() }
            ]
        });
        if (exists) {
            return res.status(400).json({ message: "Hostel with this name or code already exists" });
        }
        const hostel = await Hostel_model_1.default.create({
            name: name.trim(),
            code: code.trim().toUpperCase(),
            address: address?.trim(),
            capacity: capacity || 0
        });
        return res.status(201).json({ success: true, data: hostel });
    }
    catch (error) {
        console.error("CreateHostel error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createHostel = createHostel;
// update hostel details
const updateHostel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, capacity } = req.body;
        const hostel = await Hostel_model_1.default.findByIdAndUpdate(id, { name: name?.trim(), address: address?.trim(), capacity }, { new: true, runValidators: true });
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }
        return res.status(200).json({
            success: true,
            data: hostel
        });
    }
    catch (error) {
        console.error("UpdateHostel error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateHostel = updateHostel;
const toggleHostelStatus = async (req, res) => {
    try {
        const hostel = await Hostel_model_1.default.findById(req.params.id);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }
        hostel.isActive = !hostel.isActive;
        await hostel.save();
        return res.status(200).json({
            success: true,
            message: `Hostel ${hostel.isActive ? "activated" : "deactivated"} successfully`,
            data: hostel
        });
    }
    catch (error) {
        console.error("ToggleHostelStatus error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.toggleHostelStatus = toggleHostelStatus;
// get all hostels
const getHostels = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 100);
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === "true";
        }
        const [hostels, total] = await Promise.all([
            Hostel_model_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Hostel_model_1.default.countDocuments(filter)
        ]);
        return res.status(200).json({
            success: true,
            page,
            pages: Math.ceil(total / limit),
            total,
            data: hostels
        });
    }
    catch (error) {
        console.error("GetHostels error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getHostels = getHostels;
// GUARD CONTROLLERS
const createGuard = async (req, res) => {
    try {
        const { name, email, password, hostelId } = req.body;
        if (!name || !email || !password || !hostelId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(hostelId)) {
            return res.status(400).json({ message: "Invalid hostelId" });
        }
        const [hostel, existingUser] = await Promise.all([
            Hostel_model_1.default.findOne({ _id: hostelId, isActive: true }),
            User_model_1.default.findOne({ email: email.toLowerCase().trim() })
        ]);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 12);
        const guard = await User_model_1.default.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashed,
            role: "GUARD",
            hostelId
        });
        return res.status(201).json({
            success: true,
            message: "Guard created successfully",
            data: {
                id: guard._id,
                name: guard.name,
                email: guard.email,
                role: guard.role,
                hostelId: guard.hostelId
            }
        });
    }
    catch (error) {
        console.error("CreateGuard error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createGuard = createGuard;
// get all guards
const getGuards = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 100);
        const skip = (page - 1) * limit;
        const filter = { role: "GUARD" };
        if (req.query.hostelId)
            filter.hostelId = req.query.hostelId;
        if (req.query.isActive !== undefined)
            filter.isActive = req.query.isActive === "true";
        const [guards, total] = await Promise.all([
            User_model_1.default.find(filter)
                .populate("hostelId", "name code")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User_model_1.default.countDocuments(filter)
        ]);
        return res.status(200).json({
            success: true,
            page,
            pages: Math.ceil(total / limit),
            total,
            data: guards
        });
    }
    catch (error) {
        console.error("GetGuards error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getGuards = getGuards;
// toggle guard active/inactive
const toggleGuardStatus = async (req, res) => {
    try {
        const guard = await User_model_1.default.findOne({ _id: req.params.id, role: "GUARD" });
        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }
        guard.isActive = !guard.isActive;
        await guard.save();
        return res.status(200).json({
            success: true,
            message: `Guard ${guard.isActive ? "activated" : "deactivated"} successfully`
        });
    }
    catch (error) {
        console.error("ToggleGuardStatus error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.toggleGuardStatus = toggleGuardStatus;
// ITEM CONTROLLERS
const createItem = async (req, res) => {
    try {
        const { itemName, hostelId, totalQuantity, unit, minThreshold } = req.body;
        if (!itemName || !hostelId || totalQuantity === undefined || !unit) {
            return res.status(400).json({ message: "itemName, hostelId, totalQuantity and unit are required" });
        }
        const allowedUnits = ["KG", "LITRE", "PIECE", "PACKET", "BOX"];
        if (!allowedUnits.includes(unit)) {
            return res.status(400).json({ message: `Unit must be one of: ${allowedUnits.join(", ")}` });
        }
        if (!Number.isInteger(totalQuantity) || totalQuantity < 0) {
            return res.status(400).json({ message: "totalQuantity must be a non-negative integer" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(hostelId)) {
            return res.status(400).json({ message: "Invalid hostelId" });
        }
        const hostel = await Hostel_model_1.default.findOne({ _id: hostelId, isActive: true });
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }
        const existingItem = await Item_model_1.default.findOne({
            itemName: itemName.trim(),
            hostelId
        });
        if (existingItem) {
            return res.status(400).json({ message: "Item already exists in this hostel" });
        }
        const item = await Item_model_1.default.create({
            itemName: itemName.trim(),
            hostelId,
            totalQuantity,
            availableQuantity: totalQuantity,
            unit,
            minThreshold: minThreshold ?? 5
        });
        return res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        console.error("CreateItem error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createItem = createItem;
// update item details
const updateItem = async (req, res) => {
    try {
        const { itemName, minThreshold, unit } = req.body;
        const item = await Item_model_1.default.findByIdAndUpdate(req.params.id, { itemName: itemName?.trim(), minThreshold, unit }, { new: true, runValidators: true });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        console.error("UpdateItem error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateItem = updateItem;
// toggle item active/inactive
const toggleItemStatus = async (req, res) => {
    try {
        const item = await Item_model_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.status(200).json({
            success: true,
            message: `Item ${item.isActive ? "activated" : "deactivated"} successfully`
        });
    }
    catch (error) {
        console.error("ToggleItemStatus error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.toggleItemStatus = toggleItemStatus;
// DASHBOARD
const getDashboardStats = async (req, res) => {
    try {
        const [totalHostels, totalGuards, totalItems, totalLogs, lowStock] = await Promise.all([
            Hostel_model_1.default.countDocuments({ isActive: true }),
            User_model_1.default.countDocuments({ role: "GUARD", isActive: true }),
            Item_model_1.default.countDocuments({ isActive: true }),
            StockLog_model_1.default.countDocuments(),
            Item_model_1.default.countDocuments({
                isActive: true,
                $expr: { $lte: ["$availableQuantity", "$minThreshold"] }
            })
        ]);
        return res.status(200).json({
            success: true,
            data: {
                totalHostels,
                totalGuards,
                totalItems,
                totalLogs,
                lowStock
            }
        });
    }
    catch (error) {
        console.error("GetDashboardStats error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getDashboardStats = getDashboardStats;
