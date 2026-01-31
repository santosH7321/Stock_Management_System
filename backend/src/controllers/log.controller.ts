import { Request, Response } from "express";
import StockLog from "../models/StockLog.model";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { hostelId, userId, startDate, endDate } = req.query;

    const filter: any = {};

    if (hostelId) filter.hostelId = hostelId;
    if (userId) filter.changedBy = userId;

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const logs = await StockLog.find(filter)
      .populate("itemId", "itemName")
      .populate("hostelId", "name")
      .populate("changedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
