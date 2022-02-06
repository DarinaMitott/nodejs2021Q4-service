import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Logger } from 'winston';
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost
    ) {
  }

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const { httpAdapter } = this.httpAdapterHost;

    this.logger.error(`Exception occurred: ${exception.name}: ${exception.stack}`);

    httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url
      },
      status
    );
  }
}