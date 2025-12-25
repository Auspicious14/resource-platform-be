import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  let status = 500;
  let message = "Something went wrong. Please try again.";
  let errors: any = undefined;

  // Prisma Error Handling
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint violation
        status = 409;
        const target = (err.meta?.target as string[]) || [];
        message = `${target.join(", ")} already exists.`;
        break;
      case "P2025": // Record not found
        status = 404;
        message = err.meta?.cause as string || "Record not found.";
        break;
      case "P2003": // Foreign key constraint violation
        status = 400;
        message = "Foreign key constraint failed.";
        break;
      default:
        status = 400;
        message = `Database error: ${err.message}`;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    message = "Validation error in database request.";
  } else if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  } else if (err.status) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
