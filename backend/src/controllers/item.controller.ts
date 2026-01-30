import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import ItemModel from "../models/Item.model";


export const getItems = async (req: AuthRequest, res: Response) => {
  try {
    let items;

    if (req.user.role === "ADMIN") {
      items = await ItemModel.find().populate("hostelId", "name");
    } else {
      items = await ItemModel.find({
        hostelId: req.user.hostelId
      }).populate("hostelId", "name");
    }

    res.json(items);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
