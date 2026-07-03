import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * 🚀 bootstrap()
 * This is the ENTRY POINT of our entire application.
 *
 * Think of it like turning the ignition key in a car.
 * It:
 * 1. Creates the NestJS application
 * 2. Enables CORS (so frontend apps can talk to our API)
 * 3. Adds ValidationPipe (so invalid data gets rejected automatically)
 * 4. Adds global exception filter (so errors look clean, not scary)
 * 5. Adds logging interceptor (so we can see every request in logs)
 * 6. Starts listening on the configured port
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // WHY CORS? Cross-Origin Resource Sharing allows browsers from
  // different domains to call our API. Without this, a frontend
  // app on example.com can't call our API on api.example.com
  app.enableCors();

  // WHY ValidationPipe?
  // It automatically checks incoming requests against our DTO rules.
  // Example: if we say "title must be a string", and someone sends
  // a number, ValidationPipe rejects it with a clear error message.
  //
  // whitelist: true → removes any extra fields not in the DTO
  // forbidNonWhitelisted: true → throws error if extra fields are sent
  // transform: true → automatically converts types (string "123" → number 123)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // WHY Global Exception Filter?
  // Catches ALL unhandled errors across the entire app and formats
  // them into a consistent JSON response instead of crashing.
  app.useGlobalFilters(new AllExceptionsFilter());

  // WHY Logging Interceptor?
  // Logs every incoming HTTP request (method, URL, duration, status code)
  // This is ESSENTIAL for debugging in production.
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Read port from environment variable, fallback to 3000
  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  // Use NestJS built-in Logger for startup messages
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap();
