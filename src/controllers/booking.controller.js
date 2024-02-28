import Booking from "../model/Booking.model.js"
import RoomAvailability from '../model/Availability.model.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const createBooking = async (req, res) => {
    try {
        let { slotId, roomType } = req.body

        const isRoomAvailable = await RoomAvailability.findOne(
            {
                'timeSlots._id': new mongoose.Types.ObjectId(slotId)
            },
            {
                'timeSlots.$': 1
            }
        )
        console.log(isRoomAvailable);
        if (isRoomAvailable.timeSlots[0].available == false) {
            res.status(400).json({
                success: false,
                msg: "Room not available "
            })
            return
        }

        let booking = new Booking({
            user: req.user,
            startDate: isRoomAvailable.timeSlots[0].startDate,
            endDate: isRoomAvailable.timeSlots[0].endDate,
            roomType: roomType,
            slotId: slotId
        });
        booking = await booking.save();

        const updatedRoomStatus = await RoomAvailability.updateOne(
            {
                'timeSlots._id': new mongoose.Types.ObjectId(slotId)
            },
            {
                $set: {
                    'timeSlots.$.available': false,
                }
            }
        );

        console.log("Updated room status : ", updatedRoomStatus);
        logger.info(`createBooking : ${JSON.stringify(booking)}`);
        res.status(201).json({
            success: true,
            msg: "Booking created",
            data: booking
        })
    } catch (error) {
        console.log(error);
        logger.error(`Error create booking: ${error.message}`);
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

export const createNewBooking = async (req, res) => {
    try {
        const { startDate, endDate, roomType } = req.body;

        let result = await Booking.find({
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

        if (result.length == 0) {
            let booking = new Booking({
                user: req.user,
                startDate: startDate,
                endDate: endDate,
                roomType: roomType
            });
            booking = await booking.save();
            res.status(201).json({
                success: true,
                msg: `Room ${roomType} booked from ${startDate} to ${endDate} `
            })
        } else {
            res.status(400).json({
                success: false,
                msg: `Room ${roomType} not available from ${startDate} to ${endDate}, colliding with ${result.length} slots`,

            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

async function checkAvailiblity(slotId) {
    try {
        const isRoomAvailable = await RoomAvailability.findOne(
            {
                'timeSlots._id': new mongoose.Types.ObjectId(slotId)
            },
            {
                'timeSlots.$': 1
            }
        )
        if (isRoomAvailable.timeSlots[0].available) {
            return isRoomAvailable;
        }
        logger.info(`checkAvailiblity:${JSON.stringify(isRoomAvailable)}`);
        return {};
    } catch (error) {
        logger.error(`Error checkAvailiblity: ${error.message}`);
        console.log(error);
        return {};
    }
}

export const updateBooking = async (req, res) => {
    try {
        const { bookingId, roomType, prevSlotId, newSlotId } = req.body;

        const isRoomAvailable = await checkAvailiblity(newSlotId);
        if (!isRoomAvailable._id || isRoomAvailable.timeSlots[0].available == false) {
            res.status(400).json({
                success: false,
                msg: "Room not available"
            })
            return;
        }
        let updateExistingBooking;
        console.log(isRoomAvailable);

        const userEmail = await Booking.findById(bookingId)
        console.log(userEmail);

        if (userEmail.user !== req.user) {
            res.status(401).json({
                success: false,
                msg: "Cannot update booking of another user"
            })
            return;
        } else {
            const updatePreviousRoomStatus = await RoomAvailability.updateOne(
                {
                    'timeSlots._id': new mongoose.Types.ObjectId(prevSlotId)
                },
                {
                    $set: {
                        'timeSlots.$.available': true,
                    }
                }
            );

            const updateData = {
                $set: {
                    startDate: isRoomAvailable.timeSlots[0].startDate,
                    endDate: isRoomAvailable.timeSlots[0].endDate,
                    roomType: roomType,
                    slotId: newSlotId
                }
            }
            updateExistingBooking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true });

            console.log("updated : ", updateExistingBooking);

            const updateNewRoomStatus = await RoomAvailability.updateOne(
                {
                    'timeSlots._id': new mongoose.Types.ObjectId(newSlotId)
                },
                {
                    $set: {
                        'timeSlots.$.available': false,
                    }
                }
            );
            logger.info(`updateBooking: ${bookingId}, ${prevSlotId} to ${newSlotId}, ${roomType}`);

            res.status(201).json({
                success: true,
                msg: "Room updated successfully.",
                newRoomDetails: updateExistingBooking
            })
        }

    } catch (error) {
        console.log(error);
        logger.error(`Error updateBooking: ${error.message}`);
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userEmail = await Booking.findById(bookingId)
        console.log(userEmail);

        if (userEmail.user !== req.user) {
            res.status(401).json({
                success: false,
                msg: "Cannot update booking of another user"
            })
            return;
        } else {
            const updateBooking = await Booking.findByIdAndUpdate(bookingId, { $set: { status: "cancelled" } }, { new: true });
            console.log(updateBooking);

            const updateRoomAvailiblity = await RoomAvailability.updateOne(
                {
                    'timeSlots._id': new mongoose.Types.ObjectId(updateBooking.slotId)
                },
                {
                    $set: {
                        'timeSlots.$.available': true,
                    }
                }
            );

            console.log(updateRoomAvailiblity);
            logger.info(`cancelBooking: ${bookingId}`);
            res.status(201).json({
                success: true,
                msg: "Booking cancelled",
                data: updateBooking
            })
        }
    } catch (error) {
        console.log(error);
        logger.error(`Error cancel Booking: ${error.message}`);
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

