import mongoose from "mongoose";

export const connect_to_db = (url: string) => {
    return mongoose.connect(url);
};
