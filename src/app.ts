import express, { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as swaggerUI from 'swagger-ui-express';
import * as YAML from 'yamljs';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { setupLogger, logger } from "./logger";
import { PageNotFoundError } from "./page_not_found_error";
import { router as boardsRouter } from './resources/boards/board.router';
import { router as userRouter } from './resources/users/user.router';
import config from './ormconfig';

export const app = express();
const swaggerDocument = YAML.load(join(__dirname, '../doc/api.yaml'));

app.use(express.json());


app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    const oldJson = res.json;
    res.json = (data: object) => {
      res.locals.body = data;
      return oldJson.call(res, data);
    }
    next();
  } catch (e) {
    next(e);
  }
});

setupLogger(app);

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', userRouter);
app.use('/boards', boardsRouter);


app.get('*', () => {
  throw new PageNotFoundError('Page not found')
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof PageNotFoundError) {
    res.locals.error = err.toString();
    logger.error(`${err.name} exception is thrown`)
    res.status(404).json({error: 'Not found'});
    next();
    return;
  }
  res.status(500).json({error: 'Internal error'});
  next();
});


export const initDb = async () => {
  await createConnection(config);
}

