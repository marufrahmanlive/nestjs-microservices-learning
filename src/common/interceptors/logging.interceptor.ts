import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

/**
 * 📝 LoggingInterceptor
 *
 * WHY do we need this?
 * In production, when something goes wrong, you need to know:
 * - Who called what endpoint?
 * - When did they call it?
 * - How long did it take?
 * - What status code did they get?
 *
 * This interceptor logs every single HTTP request in a format like:
 *
 * [BooksController] GET /books 200 45ms
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;

    const now = Date.now();

    // The "tap" operator lets us run code AFTER the response is sent
    // without modifying the response itself
    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse<Response>();
        const duration = Date.now() - now;

        this.logger.log(
          `${method} ${url} ${response.statusCode} ${duration}ms`,
        );
      }),
    );
  }
}
