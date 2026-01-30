import { Request, Response } from "express";
import Hostel from "../models/Hostel.model";
import User from "../models/User.model";
import bcrypt from "bcryptjs";


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

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

