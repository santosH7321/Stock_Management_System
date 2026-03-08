import mongoose, { Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  code: string;
  address?: string;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hostelSchema = new mongoose.Schema<IHostel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
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

hostelSchema.index({ code: 1 });

hostelSchema.index({ isActive: 1 });

hostelSchema.index({ code: 1, isActive: 1 });

export default mongoose.model<IHostel>("Hostel", hostelSchema);