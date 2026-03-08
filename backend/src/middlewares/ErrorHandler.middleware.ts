import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  if (statusCode >= 500) {
    console.error(`[${req.method}] ${req.path} — ${message}`, err);
  }

  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values((err as any).errors).map(
      (e: any) => e.message
    );
    return res.status(400).json({
      success: false,
      message: messages.join(", ")
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const notFound = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
};