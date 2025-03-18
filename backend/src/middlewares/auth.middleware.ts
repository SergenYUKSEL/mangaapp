import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError, ErrorCode } from "./error.middleware";
import User, { UserRole } from "../models/user.model";

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Middleware to authenticate user using JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access denied. No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Access denied. Invalid token format", 401);
    }

    try {
      // Verify token
      const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
      const decoded = jwt.verify(token, secret) as any;

      // Attach user to request
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      throw new AppError("Invalid token", 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    if (req.user.role !== UserRole.ADMIN) {
      throw new AppError("Access denied. Admin role required", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
