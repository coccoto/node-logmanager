import winston, { Logger } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

export type Environment = 'development' | 'production'

export type LogManagerConfig = {
    environment: Environment
    logDir: string
}

let loggerInstance: Logger | null = null

export const initLogger = (config: LogManagerConfig) => {
    const dailyRotateFile = new DailyRotateFile({
        filename: config.logDir + '/%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '180',
    })
    const transports: winston.transport[] = config.environment === 'development'
        ? [new winston.transports.Console(), dailyRotateFile]
        : [dailyRotateFile]

    loggerInstance = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.json()
        ),
        transports,
    })
}

export const getLogger = (): Logger => {
    if (! loggerInstance) {
        throw new Error("Logger not initialized. Call initLogger() first.")
    }
    return loggerInstance
}

