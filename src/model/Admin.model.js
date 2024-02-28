import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const adminSchema = Schema({
    email: {
        required: true,
        unique: true,
        type: String,
        trim: true,
    },
    password: {
        type: String,
    }
});

adminSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
