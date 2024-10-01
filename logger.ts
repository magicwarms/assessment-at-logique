import * as winston from 'winston';
import { Config } from './config';
import DailyRotateFile from 'winston-daily-rotate-file';


const combinedTransport = new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const errorTransport = new DailyRotateFile({
    level: 'error',
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

type WinstonTransports = DailyRotateFile | winston.transports.ConsoleTransportInstance | winston.transports.StreamTransportInstance;

const transports: WinstonTransports[] = [
    combinedTransport,
    errorTransport
];

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: transports
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (Config.ENVIRONMENT !== 'production') {
    logger.add(new winston.transports.Console({
        level: 'debug',
        format: winston.format.simple()
    }));
}

export default logger;