import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs/operators";

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger) {
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    return next.handle()
      .pipe(tap({
        next: (value) => {
          // save for further use by morgan
          request.res_body = value;
        }
      }));
  }
}