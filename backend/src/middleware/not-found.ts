import { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
    res.status(404).send(`Route '${req.originalUrl}' does not exist`);
};
