import { Request, Response, NextFunction } from "express";
import { CustomError } from "./error";
import { CustomAPIError } from "../errors";

export const errorHandlerMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let customError: CustomError = err;

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
        customError = new CustomAPIError(err.message, 400);
    }

    // Create custom error for unhandled errors
    if (!(customError instanceof CustomAPIError)) {
        customError = new CustomAPIError(
            customError.message || "Something went wrong. Please try again.",
            customError.statusCode || 500
        );
    }

    res.status(customError.statusCode || 500).json({
        success: false,
        message: customError.message,
        ...(process.env.NODE_ENV === "development" && { error: customError }),
    });
};
