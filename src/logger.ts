import { join } from "path";
import morgan from "morgan";
import { format, transports } from "winston";
import { createWriteStream } from "fs";
import { StreamableFile } from "@nestjs/common";
import { EXIT_ON_UNHANDLED_EXCEPTION, LOG_LEVEL } from "./common/config";

export const logFormat = ':method :url :status :response-time ms - Res len: :res[content-length] - Req len: :req[content-length]\n' +
    '\tRequest body: :req_body\n' +
    '\tResponse body: :res_body\n' +
    '\tError: :error';


morgan.token('req_body', (req): string | undefined => req.body ? JSON.stringify(req.body) : undefined)
morgan.token('res_body', (req): string | undefined => {
    if (req.res_body) {
        try {
            return JSON.stringify(req.res_body)
        } catch (e) {
            return '[failed to serialize]';
        }
    }
    return undefined; // to suppress linter
});
morgan.token('error', (req, res): string | undefined => res.locals?.error ? res.locals?.error : undefined);


const levelReprToValue = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    silly: 4
};

const getLevel = (defaultLevel='all'): string => {
    interface ILevelMap {
        [key: string]: string;
    }
    const levelsMap = {
        '0': 'error',
        '1': 'warn',
        '2': 'info',
        '3': 'debug',
        '4': 'silly'
    }

    const level = LOG_LEVEL || '';
    return (levelsMap as ILevelMap)[level] || defaultLevel;
}

const minLevel = (level): string => {
    const confLevel = getLevel();
    const confVal = levelReprToValue[confLevel];
    const levelVal = levelReprToValue[level];
    return confVal > levelVal ? level : confLevel;
}

export const loggingConfig = {
    level: getLevel(),
    format: format.combine(
        format.colorize(),
        format.cli(),
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: join(__dirname, '..', 'logs', 'error.log'),
            level: minLevel('error'),
            format: format.combine(
                format.uncolorize(),
                format.json()
            )
        }),
        new transports.File({
            filename: join(__dirname, '..', 'logs', 'info.log'),
            level: minLevel('info'),
            format: format.combine(
                format.uncolorize(),
                format.json()
            )
        }),
    ]
}

export const setupLogger = async (app, logger) => {
    app.useLogger(logger);

    // file logger
    app.use(morgan(
        logFormat,
        {stream: createWriteStream(join(__dirname, '..', 'logs', 'access.log'), {flags: 'a'})}
    ));

    // console logger
    app.use(morgan(logFormat));


    process.on('uncaughtException', (error) => {
        logger.error(`Captured unhandled exception ${error.toString()}: ${error.stack}`);
        if (EXIT_ON_UNHANDLED_EXCEPTION) {
            process.exit(1);
        }
    });

    process.on('unhandledRejection', (reason: Error) => {
        logger.error(`Unhandled rejection detected: ${reason.message}`);
    });
}
