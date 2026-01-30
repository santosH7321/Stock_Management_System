import mongoose, { Document } from "mongoose";

export interface IItem extends Document {
  itemName: string;
  hostelId: mongoose.Types.ObjectId;
  totalQuantity: number;
  availableQuantity: number;
  minThreshold: number;
}

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    },
    availableQuantity: {
      type: Number,
      required: true
    },
    minThreshold: {
      type: Number,
      default: 5
    }
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", itemSchema);
