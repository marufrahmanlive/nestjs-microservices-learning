import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 🛡️ AllExceptionsFilter
 *
 * WHY do we need this?
 * Without it, when an error happens, the user sees an ugly HTML error page
 * or a stack trace that exposes our code structure (security risk!).
 *
 * This filter catches EVERY error in the app and formats it into a clean,
 * consistent JSON response that looks like:
 *
 * {
 *   "statusCode": 404,
 *   "message": "Book not found",
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "path": "/books/123"
 * }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the HTTP status code
    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      // NestJS built-in exceptions (BadRequestException, NotFoundException, etc.)
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exceptionResponse;
    } else {
      // Unexpected errors (bugs, database failures, etc.)
      // In production, we DON'T expose the real error to users
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // Log the error so we can debug it later
    this.logger.error(
      `❌ ${status} ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Send a clean JSON response
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
