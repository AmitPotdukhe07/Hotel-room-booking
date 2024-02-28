import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    format: combine(timestamp(), logFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
});

export default logger;
