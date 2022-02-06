import { config } from 'dotenv';
import { join } from 'path';

config({
  path: join(__dirname, '../../.env'),
});

export const { PORT, NODE_ENV } = process.env;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret';
export const AUTH_MODE = process.env.AUTH_MODE === 'true';
export const { LOG_LEVEL } = process.env;
export const EXIT_ON_UNHANDLED_EXCEPTION =
  process.env.EXIT_ON_UNHANDLED_EXCEPTION === 'true';
export const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;
export const HASH_ROUNDS = Number(process.env.HASH_ROUNDS) ?? 10;
export const UPLOADS_FOLDER = process.env.UPLOADS_FOLDER || join(__dirname, '../../uploads');
export const USE_FASTIFY = process.env.USE_FASTIFY === 'true';
