import { Request, Response } from "express";
import Hostel from "../models/Hostel.model";
import User from "../models/User.model";
import bcrypt from "bcryptjs";
import Item from "../models/Item.model";
import mongoose from "mongoose";
import StockLog from "../models/StockLog.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// HOSTEL CONTROLLERS
export const createHostel = async (req: Request, res: Response) => {
  try {
    const { name, code, address, capacity } = req.body; 

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const exists = await Hostel.findOne({
      $or: [
        { name: name.trim() },
        { code: code.trim().toUpperCase() }
      ]
    });

    if (exists) {
      return res.status(400).json({ message: "Hostel with this name or code already exists" });
    }

    const hostel = await Hostel.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      address: address?.trim(),
      capacity: capacity || 0
    });

    return res.status(201).json({ success: true, data: hostel });

  } catch (error) {
    console.error("CreateHostel error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// update hostel details
export const updateHostel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, capacity } = req.body;

    const hostel = await Hostel.findByIdAndUpdate(
      id,
      { name: name?.trim(), address: address?.trim(), capacity },
      { new: true, runValidators: true }
    );

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    return res.status(200).json({ 
      success: true, 
      data: hostel 
    });

  } catch (error) {
    console.error("UpdateHostel error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleHostelStatus = async (req: Request, res: Response) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

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

  } catch (error) {
    console.error("ToggleHostelStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get all hostels
export const getHostels = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    const [hostels, total] = await Promise.all([
      Hostel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Hostel.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      data: hostels
    });

  } catch (error) {
    console.error("GetHostels error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GUARD CONTROLLERS
export const createGuard = async (req: Request, res: Response) => {
  try {
    const { name, email, password, hostelId } = req.body;

    if (!name || !email || !password || !hostelId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ message: "Invalid hostelId" });
    }

    const [hostel, existingUser] = await Promise.all([
      Hostel.findOne({ _id: hostelId, isActive: true }),
      User.findOne({ email: email.toLowerCase().trim() })
    ]);

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 12); 

    const guard = await User.create({
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

  } catch (error) {
    console.error("CreateGuard error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get all guards
export const getGuards = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { role: "GUARD" };

    if (req.query.hostelId) filter.hostelId = req.query.hostelId;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";

    const [guards, total] = await Promise.all([
      User.find(filter)
        .populate("hostelId", "name code")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      data: guards
    });

  } catch (error) {
    console.error("GetGuards error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// toggle guard active/inactive
export const toggleGuardStatus = async (req: Request, res: Response) => {
  try {
    const guard = await User.findOne({ _id: req.params.id, role: "GUARD" });

    if (!guard) {
      return res.status(404).json({ message: "Guard not found" });
    }

    guard.isActive = !guard.isActive;
    await guard.save();

    return res.status(200).json({
      success: true,
      message: `Guard ${guard.isActive ? "activated" : "deactivated"} successfully`
    });

  } catch (error) {
    console.error("ToggleGuardStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ITEM CONTROLLERS
export const createItem = async (req: Request, res: Response) => {
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

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ message: "Invalid hostelId" });
    }

    const hostel = await Hostel.findOne({ _id: hostelId, isActive: true });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const existingItem = await Item.findOne({
      itemName: itemName.trim(),
      hostelId
    });

    if (existingItem) {
      return res.status(400).json({ message: "Item already exists in this hostel" });
    }

    const item = await Item.create({
      itemName: itemName.trim(),
      hostelId,
      totalQuantity,
      availableQuantity: totalQuantity,
      unit, 
      minThreshold: minThreshold ?? 5
    });

    return res.status(201).json({ success: true, data: item });

  } catch (error) {
    console.error("CreateItem error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// update item details
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { itemName, minThreshold, unit } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { itemName: itemName?.trim(), minThreshold, unit },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ success: true, data: item });

  } catch (error) {
    console.error("UpdateItem error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// toggle item active/inactive
export const toggleItemStatus = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.isActive = !item.isActive;
    await item.save();

    return res.status(200).json({
      success: true,
      message: `Item ${item.isActive ? "activated" : "deactivated"} successfully`
    });

  } catch (error) {
    console.error("ToggleItemStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DASHBOARD
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalHostels,
      totalGuards,
      totalItems,
      totalLogs,
      lowStock
    ] = await Promise.all([
      Hostel.countDocuments({ isActive: true }),
      User.countDocuments({ role: "GUARD", isActive: true }),
      Item.countDocuments({ isActive: true }),
      StockLog.countDocuments(),
      Item.countDocuments({
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

  } catch (error) {
    console.error("GetDashboardStats error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};