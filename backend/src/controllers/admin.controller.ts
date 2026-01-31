import { Request, Response } from "express";
import Hostel from "../models/Hostel.model";
import User from "../models/User.model";
import bcrypt from "bcryptjs";
import Item from "../models/Item.model";
import mongoose from "mongoose";
import StockLogModel from "../models/StockLog.model";
import ItemModel from "../models/Item.model";


export const createHostel = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;

    const exists = await Hostel.findOne({
      $or: [{ name }, { code }]
    });

    if (exists)
      return res.status(400).json({
        message: "Hostel already exists"
      });

    const hostel = await Hostel.create({ name, code });

    res.status(201).json(hostel);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const createGuard = async (req: Request, res: Response) => {
  try {
    const { name, email, password, hostelId } = req.body;

    const hostel = await Hostel.findById(hostelId);

    if (!hostel)
      return res.status(404).json({
        message: "Hostel not found"
      });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({
        message: "User already exists"
      });

    const hashed = await bcrypt.hash(password, 10);

    const guard = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "GUARD",
      hostelId
    });

    res.status(201).json({
      message: "Guard created successfully",
      guard
    });

  } catch (error) {
    res.status(500).json({
        message: "Server error",
        error
    });
    }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { itemName, hostelId, totalQuantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({
        message: "Invalid hostelId"
      });
    }

    const item = await Item.create({
      itemName,
      hostelId,
      totalQuantity,
      availableQuantity: totalQuantity
    });

    res.status(201).json(item);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalItems = await ItemModel.countDocuments();
    const totalLogs = await StockLogModel.countDocuments();
    const lowStock = await Item.countDocuments({
      $expr: { $lte: ["$availableQuantity", "$minThreshold"] }
    });

    res.json({
      success: true,
      data: {
        totalItems,
        totalLogs,
        lowStock
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
