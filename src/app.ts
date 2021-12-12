import express, { Request, Response, NextFunction } from 'express';


import * as swaggerUI from 'swagger-ui-express';
import { join } from 'path';
import * as YAML from 'yamljs';
import { router as boardsRouter } from './resources/boards/board.router';
import { router as userRouter } from './resources/users/user.router';


export const app = express();
const swaggerDocument = YAML.load(join(__dirname, '../doc/api.yaml'));

app.use(express.json());

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


app.get('*', (req, res) => {
  res.status(404).json({error: 'Not found'});
});
