import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface IUserPayload {
  id: string;
  role: "ADMIN" | "GUARD";
  hostelId?: string | null;
}

export interface AuthRequest extends Request {
  user: IUserPayload;
}

const getTokenFromCookieHeader = (cookieHeader?: string) => {
  if (!cookieHeader) return null;

  const tokenCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("token="));

  if (!tokenCookie) return null;

  return decodeURIComponent(tokenCookie.slice("token=".length));
};

export const protect = ((
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const authHeaderToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = getTokenFromCookieHeader(req.headers.cookie) || authHeaderToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IUserPayload;
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
}) as RequestHandler;

export const isGuard = ((
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "GUARD") {
    return res.status(403).json({ message: "Guard access only" });
  }
  next();
}) as RequestHandler;

export const isAdminOrGuard = ((
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !["ADMIN", "GUARD"].includes(req.user.role)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
}) as RequestHandler;
