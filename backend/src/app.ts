import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { connect_to_db } from "./db";
import { router as routes } from "./routes";
import { notFound } from "./middleware/not-found";
import { CustomError, errorHandler } from "./middleware/error";
import { errorHandlerMiddleware } from "./middleware/error-handler";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/v1/", routes);
app.use(notFound);
// app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
//     errorHandler(err, req, res, next);
// });
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connect_to_db(process.env.MONGODB_API_KEY as string);

        app.listen(port, () => {
            console.log(`Server listening at port ${port}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        setTimeout(start, 1000);
    }
};

start()
    .then()
    .catch((e) => console.log(e));
