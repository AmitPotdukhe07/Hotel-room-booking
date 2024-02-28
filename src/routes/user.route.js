import express from 'express';
import { checkAvailability, signUp, signIn, adminSignUp, adminSignIn } from '../controllers/user.controller.js';
import { userAuth } from '../middleware/userAuth.middleware.js';
import { emailValidationRules, validate } from '../utils/validate.js';
const userRouter = express.Router();

userRouter.post("/user/signup", emailValidationRules, validate, signUp)
userRouter.post("/admin/signup", emailValidationRules, validate, adminSignUp)
userRouter.post("/user/signin", emailValidationRules, validate, signIn)
userRouter.post("/admin/signin", emailValidationRules, validate, adminSignIn)
userRouter.get('/availability', userAuth, checkAvailability);

export default userRouter