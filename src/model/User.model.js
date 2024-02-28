import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = Schema({
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

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
