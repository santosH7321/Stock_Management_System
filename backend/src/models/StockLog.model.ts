import mongoose, { Document } from "mongoose";

export interface IStockLog extends Document {
  itemId: mongoose.Types.ObjectId;
  hostelId: mongoose.Types.ObjectId;
  changedBy: mongoose.Types.ObjectId;
  role: "ADMIN" | "GUARD";
  action: "INCREASE" | "DECREASE";
  quantity: number;
  beforeQty: number;
  afterQty: number;
  remark: string;
}

const stockLogSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "GUARD"],
      required: true
    },
    action: {
      type: String,
      enum: ["INCREASE", "DECREASE"],
      required: true
    },
    quantity: Number,
    beforeQty: Number,
    afterQty: Number,
    remark: String
  },
  { timestamps: true }
);

export default mongoose.model<IStockLog>("StockLog", stockLogSchema);
