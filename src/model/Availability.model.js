import { Schema, model } from "mongoose";
import mongoose from 'mongoose';

const availibilitySchema = Schema({
    roomType: {
        type: String,
        unique: true
    },
    timeSlots: [
        {
            available: {
                type: Boolean,
                required: true,
            },
            startDate: {
                type: String,
                required: true,
            },
            endDate: {
                type: String,
                required: true,
            },
        },
    ],
});

const RoomAvailability = mongoose.model('RoomAvailability', availibilitySchema);
export default RoomAvailability;
