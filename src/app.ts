import express, { Request, Response, NextFunction } from 'express';
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
import { router as userRouter } from './resources/users/user.router';
import { router as boardsRouter } from './resources/boards/board.router';


const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

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

module.exports = app;
