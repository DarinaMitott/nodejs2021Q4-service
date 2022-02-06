import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import 'reflect-metadata';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from './app.module';
import { PORT, USE_FASTIFY } from "./common/config";
import { HttpExceptionFilter } from "./http-exception.filter";
import { setupLogger } from "./logger";
import { RequestLoggingInterceptor } from "./request-logging.interceptor";

async function bootstrap() {
  const appOptions = { cors: true, bufferLogs: true };
  const app = USE_FASTIFY
    ? await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({logger: true}))
    : await NestFactory.create(AppModule, appOptions);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  await setupLogger(app, logger);
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(logger, adapterHost));
  app.useGlobalInterceptors(new RequestLoggingInterceptor(logger));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.init();
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
