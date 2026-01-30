import mongoose, { Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  code: string;
  isActive: boolean;
}

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IHostel>("Hostel", hostelSchema);
