import express, { json } from 'express';
import RoomAvailability from '../model/Availability.model.js';
import { adminAuth } from '../middleware/adminAuth.middleware.js';
const availibilityRouter = express.Router();

availibilityRouter.post("/admin/add-availability", adminAuth, async (req, res) => {
    try {
        const { roomType, timeSlots } = req.body;
        console.log(req.body);

        let availability = new RoomAvailability(req.body);
        availability = await availability.save();
        res.status(201).json({
            success: true,
            msg: "added availibility created."
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
})

export default availibilityRouter