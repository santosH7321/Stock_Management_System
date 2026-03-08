import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import ItemModel from "../models/Item.model";

export const getItems = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);     // ✅ minimum page is 1
    const limit = Math.min(Number(req.query.limit) || 10, 100); // ✅ max limit is 100
    const search = (req.query.search as string)?.trim();

    // ✅ Whitelist sort fields — prevents field injection
    const allowedSortFields = ["createdAt", "itemName", "availableQuantity", "totalQuantity"];
    const sort = allowedSortFields.includes(req.query.sort as string)
      ? (req.query.sort as string)
      : "createdAt";

    const skip = (page - 1) * limit;

    // ✅ isActive: true by default — never return disabled items
    let filter: Record<string, any> = { isActive: true };

    // ✅ GUARD only sees their hostel's items
    if (req.user.role === "GUARD") {
      filter.hostelId = req.user.hostelId;
    }

    // ✅ ADMIN can filter by specific hostel
    if (req.user.role === "ADMIN" && req.query.hostelId) {
      filter.hostelId = req.query.hostelId;
    }

    if (search) {
      filter.itemName = { $regex: search, $options: "i" };
    }

    // ✅ Run both queries in parallel — faster response
    const [items, total] = await Promise.all([
      ItemModel.find(filter)
        .populate("hostelId", "name code")  // ✅ Added code field
        .sort({ [sort]: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),                            // ✅ .lean() — returns plain JS object, faster
      ItemModel.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      data: items
    });

  } catch (error) {
    console.error("GetItems error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getItemById = async (req: AuthRequest, res: Response) => {
  try {
    const item = await ItemModel.findById(req.params.id)
      .populate("hostelId", "name code")
      .lean();

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (
      req.user.role === "GUARD" &&
      item.hostelId.toString() !== req.user.hostelId?.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized hostel access" });
    }

    return res.status(200).json({ success: true, data: item });

  } catch (error) {
    console.error("GetItemById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getLowStockItems = async (req: AuthRequest, res: Response) => {
  try {
    let filter: Record<string, any> = {
      isActive: true,
      $expr: { $lte: ["$availableQuantity", "$minThreshold"] }
    };

    if (req.user.role === "GUARD") {
      filter.hostelId = req.user.hostelId;
    }

    if (req.user.role === "ADMIN" && req.query.hostelId) {
      filter.hostelId = req.query.hostelId;
    }

    const items = await ItemModel.find(filter)
      .populate("hostelId", "name code")
      .sort({ availableQuantity: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: items.length,
      data: items
    });

  } catch (error) {
    console.error("GetLowStockItems error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};