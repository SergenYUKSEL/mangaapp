import { Request, Response, NextFunction } from "express";

// Custom error class with status code
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error codes enum for consistent error responses
export enum ErrorCode {
  INVALID_INPUT = "INVALID_INPUT",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER = "INTERNAL_SERVER",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
  API_ERROR = "API_ERROR",
}

// Global error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default to 500 internal server error
  let statusCode = 500;
  let errorCode = ErrorCode.INTERNAL_SERVER;
  let message = err.message || "Something went wrong";

  // If it's our custom AppError, use its status code
  if ("statusCode" in err) {
    statusCode = err.statusCode;

    // Map status code to error code
    switch (statusCode) {
      case 400:
        errorCode = ErrorCode.INVALID_INPUT;
        break;
      case 401:
        errorCode = ErrorCode.UNAUTHORIZED;
        break;
      case 403:
        errorCode = ErrorCode.FORBIDDEN;
        break;
      case 404:
        errorCode = ErrorCode.NOT_FOUND;
        break;
      case 422:
        errorCode = ErrorCode.VALIDATION_ERROR;
        break;
      case 409:
        errorCode = ErrorCode.DUPLICATE_ENTRY;
        break;
      default:
        errorCode = ErrorCode.INTERNAL_SERVER;
    }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = ErrorCode.VALIDATION_ERROR;
  }

  // Mongoose duplicate key error
  if (err.name === "MongoError" && (err as any).code === 11000) {
    statusCode = 409;
    errorCode = ErrorCode.DUPLICATE_ENTRY;
    message = "Duplicate entry";
  }

  // Log the error (in production, might use a logging service)
  console.error(err);

  // Send error response
  res.status(statusCode).json({
    success: false,
    errorCode,
    message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async handler to reduce try/catch boilerplate
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
