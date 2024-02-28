import { check, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit';

export const emailValidationRules = [
    check('email').isEmail().withMessage('Invalid email address'),
];

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (errors.isEmpty()) {
        return next();
    } else {
        console.log('Email validation failed ', errors);
        return res.status(400).json({ errors: errors.array() });
    }
};

export const limiter = rateLimit({
    windowMs: 10000,
    max: 70,
    message: 'Too many requests, please try again later.',
});

