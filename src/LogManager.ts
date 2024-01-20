import winston, { Logger, LogEntry } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import dotenv from 'dotenv'

dotenv.config()

const transports = (): winston.transport[] => {
    switch (process.env['ENVIRONMENT']) {
        case 'development':
            return [
                new winston.transports.Console(),
                new DailyRotateFile({
                    filename: process.env['LOG_DIR'] + '/%DATE%.log',
                    datePattern: 'YYYY',
                }),
            ]
        case 'production':
            return [
                new DailyRotateFile({
                    filename: process.env['LOG_DIR'] + '/%DATE%.log',
                    datePattern: 'YYYY',
                }),
            ]
        default:
            throw new Error("[ERROR] Invalid environment. env['ENVIRONMENT']: " + process.env['ENVIRONMENT'])
    }
}

const logManager = (): Logger => winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.printf((info: LogEntry) => {
            return JSON.stringify(info)
        }),
    ),
    transports: transports()
})

export const logger = logManager()
