import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const userAuth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({ msg: "No auth token, access denied" });

        const verified = jwt.verify(token, process.env.JWT_SECRET_USER);
        if (!verified)
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });

        req.user = verified.id;
        req.token = token;
        next();
    } catch (error) {
        console.log(error);
        logger.error(`Error during user token verification: ${error.message}`);
        res.status(401).json({
            success: false,
            msg: "Error in token verification"
        })
    }
}
