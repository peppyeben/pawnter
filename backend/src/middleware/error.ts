// src/middleware/error-handler.ts
import { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "../errors";

export interface CustomError extends Error {
    statusCode?: number;
    success?: boolean;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    // If no headers have been sent, proceed with error response
    if (!res.headersSent) {
        const statusCode = err.statusCode || 500;

        if (err instanceof CustomAPIError) {
            return res.status(statusCode).json({
                msg: err.message,
                success: false,
            });
        }

        return res.status(statusCode).json({
            msg: "Something went wrong",
            success: false,
            error: process.env.NODE_ENV === "development" ? err : {},
        });
    }

    // If headers have been sent, pass to default Express error handler
    next(err);
};
