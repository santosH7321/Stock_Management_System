import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const isGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== "GUARD") {
    return res.status(403).json({ message: "Guard access only" });
  }
  next();
};
