import winston, { Logger, LogEntry } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

type Environment = 'development' | 'production'

const transports = (environment: Environment, logDir: string): winston.transport[] => {
    switch (environment) {
        case 'development':
            return [
                new winston.transports.Console(),
                new DailyRotateFile({
                    filename: logDir + '/%DATE%.log',
                    datePattern: 'YYYY',
                }),
            ]
        case 'production':
            return [
                new DailyRotateFile({
                    filename: logDir + '/%DATE%.log',
                    datePattern: 'YYYY',
                }),
            ]
        default:
            throw new Error("[ERROR] Invalid environment. env['ENVIRONMENT']: " + environment)
    }
}

const LoggerManager = (environment: Environment, logDir: string): Logger => winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.printf((info: LogEntry) => {
            return JSON.stringify(info)
        }),
    ),
    transports: transports(environment, logDir)
})

export default LoggerManager
