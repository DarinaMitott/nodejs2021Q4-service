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
import { checkAuthenticationMiddleware, loginUser } from "./auth";
import { User } from "./resources/users/user.model";
import { create as createUser } from './resources/users/user.service';


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

app.post('/login', async (req: Request, res: Response) => {
  const { login, password } = req.body;
  if (typeof login !== 'string' || !login.trim() || typeof password !== 'string' || !password.trim()) {
    res.status(400).json({error: 'Bad request'});
    return;
  }
  loginUser(login, password)
      .then(async token => {
        if (!token) {
          res.status(403).json({error: 'Forbidden'});
          return;
        }

        res.json({token});
      });
});



app.use('/users', checkAuthenticationMiddleware, userRouter);
app.use('/boards', checkAuthenticationMiddleware, boardsRouter);


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
  const conn = await createConnection(config);
  await conn.runMigrations();

  // make sure there is `admin:admin` user
  // testing code
  const repo = conn.getRepository(User);
  const user = await repo.findOne({login: 'admin'});
  if (!user) {
    await createUser('Admin', 'admin', 'admin');
  }
}

