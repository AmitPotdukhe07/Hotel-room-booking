import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: String,
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
    roomType: {
        type: String,
        required: true,
    },
    slotId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active',
    },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking