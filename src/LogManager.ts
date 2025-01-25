import winston, { Logger } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import dotenv from 'dotenv'

dotenv.config()

const transports = (): winston.transport[] => {
    const dailyRotateFile = new DailyRotateFile({
        filename: process.env['LOG_DIR'] + '/%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '180',
    })
    if (process.env['ENVIRONMENT'] === 'development') {
        return [
            new winston.transports.Console(),
            dailyRotateFile,
        ]
    } else if (process.env['ENVIRONMENT'] === 'production') {
        return [
            dailyRotateFile,
        ]
    } else {
        throw new Error("[ERROR] Invalid environment. env['ENVIRONMENT']: " + process.env['ENVIRONMENT'])
    }
}

const logManager = (): Logger => winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.json(),
    ),
    transports: transports()
})

export const logger = logManager()
