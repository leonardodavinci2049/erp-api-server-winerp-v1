import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `URL: ${request.url} METHOD: ${request.method} After...${Date.now() - now}  ms`,
          ),
        ),
      );
  }
}
