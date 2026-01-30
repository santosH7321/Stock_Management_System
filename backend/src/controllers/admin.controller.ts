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
