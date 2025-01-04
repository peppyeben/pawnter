import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();

export const checkRequiredHeaders = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Explicitly specify return type as void
    // Parse multiple headers from environment variables
    const requiredHeadersString = process.env.REQUIRED_HEADERS || "";
    const requiredHeadersArray = requiredHeadersString
        .split(",")
        .map((header) => header.trim());

    // Validate each required header
    const missingHeaders: string[] = [];

    requiredHeadersArray.forEach((headerKey) => {
        const requiredHeaderValue = process.env[
            `HEADER_${headerKey.toUpperCase()}_VALUE`
        ] as string;
        const requestHeaderValue = req.header(headerKey);

        if (!requestHeaderValue || requestHeaderValue !== requiredHeaderValue) {
            missingHeaders.push(headerKey);
        }
    });

    // If any headers are missing or invalid, return an error
    if (missingHeaders.length > 0) {
        res.status(400).json({
            success: false,
            message: `Missing or invalid headers: ${missingHeaders.join(", ")}`,
            missingHeaders,
        });
        return; // Important: return to prevent continuing to next middleware
    }

    next(); // Call next if all headers are valid
};
