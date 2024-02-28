import User from '../model/User.model.js';
import Admin from '../model/Admin.model.js'
import RoomAvailability from '../model/Availability.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import redisClient from '../config/cache.js'
import logger from '../utils/logger.js';
import Booking from '../model/Booking.model.js';

export const signUp = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        logger.info(`user signup: ${JSON.stringify(req.body)}`);

        const existingUser = await User.findOne({
            email: email
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ msg: "User with same email or mobile already exists!" });
        }

        let user = new User({
            email,
            password: password,
        });
        user = await user.save();
        res.status(201).json({
            success: true,
            msg: "User created."
        })
    } catch (error) {
        console.log(error);
        logger.error(`Error during user sigup: ${error.message}`);
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

export const checkAvailability = async (req, res) => {
    try {
        logger.info(`Check Availability up: ${req.user}`);
        let query = {};
        let result;

        // const cachedData = await redisClient.get("roomAvailability")
        // if (cachedData) {
        //     console.log("Redis cache hit");
        //     res.status(200).json(JSON.parse(cachedData));
        //     return;
        // }
        if (req.query.startDate && req.query.endDate) {
            const startDate = req.query.startDate
            const endDate = req.query.endDate
            const roomType = req.query.roomType

            result = await Booking.find({
                "roomType": roomType,
                $or: [
                    {
                        "startDate": { $lte: endDate },
                        "endDate": { $gte: startDate }
                    },
                    {
                        "startDate": { $gte: startDate },
                        "endDate": { $lte: endDate }
                    }
                ]
            });

            console.log(result);
            // for (const slot of result.timeSlots) {
            //     if (slot.startDate == startDate && slot.endDate == endDate) {
            //         result.timeSlots = slot
            //         break;
            //     }
            // }
        } else {
            result = await RoomAvailability.find(query);
            // redisClient.setEx("roomAvailability", 25, JSON.stringify(result));
        }
        const response = {
            success: true,
            msg: result.length == 0 ? "Slot is available for booking" : `Slot is not available, ${result.length} slots are colliding`,
            slots: result
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching availability:', error);
        logger.error(`Error during check availability: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info(`user signin: ${JSON.stringify(req.body)}`);
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ msg: "User with this email does not exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password." });
        }
        console.log(process.env.JWT_SECRET_USER);
        const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET_USER);
        logger.info(`signin successfull: ${JSON.stringify(req.body)}, ${token}`);
        res.status(200).json({ success: true, token, ...user._doc });
    } catch (error) {
        console.log(error);
        logger.error(`Error during user signin: ${error.message}`);

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const adminSignUp = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const existingadmin = await Admin.findOne({
            email: email
        });
        if (existingadmin) {
            return res
                .status(400)
                .json({ msg: "Admin with same email or mobile already exists!" });
        }

        let admin = new Admin({
            email,
            password: password,
        });
        admin = await admin.save();
        logger.info(`admin signup: ${JSON.stringify(req.body)}`);

        res.status(201).json({
            success: true,
            msg: "Admin created."
        })
    } catch (error) {
        console.log(error);
        logger.error(`Error during admin sigup: ${error.message}`);

        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

export const adminSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res
                .status(400)
                .json({ msg: "Admin with this email does not exist!" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password." });
        }
        console.log(process.env.JWT_SECRET_ADMIN);
        const token = jwt.sign({ id: admin.email }, process.env.JWT_SECRET_ADMIN);
        logger.info(`admin signin successfull: ${JSON.stringify(req.body)}, ${token}`);

        res.status(200).json({ success: true, token, ...admin._doc });
    } catch (error) {
        console.log(error);
        logger.error(`Error during admin signin: ${error.message}`);

        res.status(500).json({ error: 'Internal Server Error' });
    }
}