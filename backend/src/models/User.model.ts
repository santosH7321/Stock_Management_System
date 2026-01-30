import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "GUARD";
  hostelId?: mongoose.Types.ObjectId | null;
  isActive: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["ADMIN", "GUARD"], required: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", default: null },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
