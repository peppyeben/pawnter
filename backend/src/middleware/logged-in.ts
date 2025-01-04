import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomAPIError } from "../errors";

import * as dotenv from "dotenv";

dotenv.config();

// Extend the Request interface to include the custom userPawnterID
declare global {
    namespace Express {
        interface Request {
            userPawnterID?: string;
        }
    }
}

// Define the structure of the JWT payload
interface JwtPayload {
    userPawnterID: string;
    // Add any other fields you typically include in your JWT
    email?: string;
    role?: string;
}

export const isPawnterLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authBearer = req.headers.authorization;

    if (!authBearer || !authBearer.startsWith("Bearer ")) {
        return next(new CustomAPIError("No Token Available", 401));
    }

    const token = authBearer.split(" ")[1];

    try {
        // Type-safe JWT verification
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string
        ) as JwtPayload;

        // Attach userPawnterID to the request for downstream use
        req.userPawnterID = decoded.userPawnterID;

        console.log("User decoded", decoded);
        next();
    } catch (error) {
        console.error("Login verification failed:", error);

        if (error instanceof jwt.TokenExpiredError) {
            return next(
                new CustomAPIError("Token expired. Please log in again.", 401)
            );
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(
                new CustomAPIError("Invalid token. Authentication failed.", 401)
            );
        }

        // Generic error for other unexpected issues
        next(new CustomAPIError("Forbidden - You have to be logged in", 403));
    }
};
