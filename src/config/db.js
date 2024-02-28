import dotenv from 'dotenv';
dotenv.config();

const DB = process.env.MONGO_URI;
import mongoose from "mongoose";

const startDB = async () => {
    try {
        mongoose
            .connect(DB)
            .then(() => {
                console.log("Connected to DB");
            })
            .catch((e) => {
                console.log(e);
            });
    } catch (error) {
        console.log(error);
    }
}
export default startDB