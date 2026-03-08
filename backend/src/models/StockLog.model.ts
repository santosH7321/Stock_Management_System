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
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

const stockLogSchema = new mongoose.Schema<IStockLog>(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "GUARD"],
      required: true,
    },
    action: {
      type: String,
      enum: ["INCREASE", "DECREASE"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    beforeQty: {
      type: Number,
      required: true,
      min: 0,
    },
    afterQty: {
      type: Number,
      required: true,
      min: 0,
    },
    remark: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

stockLogSchema.index({ hostelId: 1, createdAt: -1 });

stockLogSchema.index({ itemId: 1, createdAt: -1 });

stockLogSchema.index({ changedBy: 1, createdAt: -1 });

export default mongoose.model<IStockLog>("StockLog", stockLogSchema);