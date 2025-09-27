import winston from "winston";


const winstonLogger=winston.createLogger({
    level:process.env.LOG_LEVEL|| "info",
    defaultMeta:{
        service:"cartMicroservice",
        buildInfo:{
            version:"1.0.0",
            nodeVersion:process.env.version
        }
    },
    transports:[
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            format:winston.format.combine(
                winston.format.json(),
                winston.format.timestamp()
            ),
            filename: process.env.stdoutPath || 'combined.log'
        }),
        new winston.transports.File({
            format:winston.format.combine(
                winston.format.json(),
                winston.format.timestamp()
            ),
            filename:process.env.stderrPath || 'error.log',
            level:'error'
        }),

    ]
})

export default winstonLogger;