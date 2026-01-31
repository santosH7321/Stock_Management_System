import { Response, Request } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import ItemModel from "../models/Item.model";


export const getItems = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const sort = (req.query.sort as string) || "createdAt";

    const skip = (page - 1) * limit;

    let filter: any = {};
    if (req.user.role === "GUARD") {
      filter.hostelId = req.user.hostelId;
    }

    if (search) {
      filter.itemName = { $regex: search, $options: "i" };
    }

    const items = await ItemModel.find(filter)
      .populate("hostelId", "name")
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ItemModel.countDocuments(filter);

    res.json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      data: items
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLowStockItems = async (req: AuthRequest, res: Response) => {
  try {
    const items = await ItemModel.find({
      $expr: { $lte: ["$availableQuantity", "$minThreshold"] }
    }).populate("hostelId", "name");

    res.json({
      success: true,
      data: items
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

