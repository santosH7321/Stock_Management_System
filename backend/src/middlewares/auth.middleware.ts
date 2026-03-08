import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface IUserPayload {
  id: string;
  role: "ADMIN" | "GUARD";
  hostelId?: string | null;
}

export interface AuthRequest extends Request {
  user: IUserPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};