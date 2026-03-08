import mongoose, { Document } from "mongoose";

export interface IItem extends Document {
  itemName: string;
  hostelId: mongoose.Types.ObjectId;
  unit: "KG" | "LITRE" | "PIECE" | "PACKET" | "BOX";
  totalQuantity: number;
  availableQuantity: number;
  minThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new mongoose.Schema<IItem>(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    unit: {
      type: String,
      enum: ["KG", "LITRE", "PIECE", "PACKET", "BOX"],
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

itemSchema.index(
  { 
    itemName: 1, 
    hostelId: 1 
  }, 
  { 
    unique: true 
  }
);

itemSchema.index(
  { 
    hostelId: 1, 
    isActive: 1 
  }
);

itemSchema.index(
  { 
    hostelId: 1, 
    availableQuantity: 1 
  }
);

export default mongoose.model<IItem>("Item", itemSchema);