import { config } from 'dotenv';
import { join } from 'path';

config({
  path: join(__dirname, '../../.env')
});

export const {PORT, NODE_ENV} = process.env;
export const {JWT_SECRET_KEY} = process.env;
export const AUTH_MODE = process.env.AUTH_MODE === 'true';
export const {LOG_LEVEL} = process.env;
export const EXIT_ON_UNHANDLED_EXCEPTION = process.env.EXIT_ON_UNHANDLED_EXCEPTION === 'true';
export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT } = process.env;
