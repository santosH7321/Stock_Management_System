import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "GUARD";
  hostelId?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "GUARD"],
      required: true,
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.password = undefined;
        return ret;
      }
    },
    toObject: {
      transform: (_doc, ret) => {
        ret.password = undefined;
        return ret;
      }
    }
  }
);

userSchema.index({ hostelId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ hostelId: 1, role: 1, isActive: 1 });

export default mongoose.model<IUser>("User", userSchema);