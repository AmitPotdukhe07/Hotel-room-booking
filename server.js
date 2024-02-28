import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import log from 'morgan';
import cors from 'cors';
import startDB from './src/config/db.js';
import { limiter } from './src/utils/validate.js';
import bookingsRoute from './src/routes/bookings.route.js';
import userRoute from './src/routes/user.route.js';
import availibilityRouter from './src/routes/availiblity.route.js';
import client from './src/config/cache.js';
import logger from './src/utils/logger.js';
const app = express();
startDB();

app.use(log("dev"));
app.use(limiter);
app.use(json());
app.use(cors());
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500).json({ error: err.message });
});

// (async () => {
//     await client.connect();
// })();
// client.on('connect', () => {
//     console.log("Connected to redis");
// });
// client.on("error", (err) => {
//     console.log(`Error:${err}`);
// });

app.use('/api/v1', bookingsRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', availibilityRouter);

app.listen(process.env.PORT, () => {
    console.log(`Service is running on ${process.env.PORT} port.`);
})
