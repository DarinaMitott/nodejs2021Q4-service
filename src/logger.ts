import { Express, Request, Response } from "express";
import { createWriteStream } from "fs";
import morgan from "morgan";
import { join } from "path";
import { createLogger, format, transports } from 'winston';

import { LOG_LEVEL, EXIT_ON_UNHANDLED_EXCEPTION } from './common/config';

export const logFormat = ':method :url :status :response-time ms - Res len: :res[content-length] - Req len: :req[content-length]\n' +
    '\tRequest body: :req_body\n' +
    '\tResponse body: :res_body\n' +
    '\tError: :error';


morgan.token('req_body', (req: Request): string | undefined => req.body ? JSON.stringify(req.body) : undefined)
morgan.token('res_body', (req: Request, res: Response): string | undefined => res.locals.body ? JSON.stringify(res.locals.body) : undefined);
morgan.token('error', (req: Request, res: Response): string | undefined => res.locals.error ? res.locals.error : undefined);


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

export const logger = createLogger({
    level: getLevel(),
    format: format.combine(
        format.colorize(),
        format.cli(),
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: join(__dirname, '..', 'logs', 'error.log'),
            level: 'error',
            format: format.combine(
                format.uncolorize(),
                format.json()
            )
        }),
        new transports.File({
            filename: join(__dirname, '..', 'logs', 'info.log'),
            level: 'info',
            format: format.combine(
                format.uncolorize(),
                format.json()
            )
        }),
    ]
});


export const setupLogger = (app: Express) => {
    // file logger
    app.use(morgan(
        logFormat,
        {stream: createWriteStream(join(__dirname, '..', 'logs', 'access.log'), {flags: 'a'})}
    ));

    // console logger
    app.use(morgan(logFormat));


    process.on('uncaughtException', (error) => {
        logger.error(`Captured unhandled exception ${error.toString()}`);
        if (EXIT_ON_UNHANDLED_EXCEPTION) {
            process.exit(1);
        }
    });

    process.on('unhandledRejection', (reason: Error) => {
        logger.error(`Unhandled rejection detected: ${reason.message}`);
    });
}
