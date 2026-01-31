import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Item from "../models/Item.model";
import StockLog from "../models/StockLog.model";

export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const { action, quantity, remark } = req.body;

    const item = await Item.findById(itemId);

    if (!item)
      return res.status(404).json({
        message: "Item not found"
      });
    if (
      req.user.role === "GUARD" &&
      item.hostelId.toString() !== req.user.hostelId
    ) {
      return res.status(403).json({
        message: "Unauthorized hostel access"
      });
    }

    const beforeQty = item.availableQuantity;

    if (action === "DECREASE" && beforeQty < quantity) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    if (action === "INCREASE") {
      item.availableQuantity += quantity;
      item.totalQuantity += quantity;
    } else {
      item.availableQuantity -= quantity;
    }

    const afterQty = item.availableQuantity;

    await item.save();

    await StockLog.create({
      itemId: item._id,
      hostelId: item.hostelId,
      changedBy: req.user.id,
      role: req.user.role,
      action,
      quantity,
      beforeQty,
      afterQty,
      remark
    });

    res.json({
      message: "Stock updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
