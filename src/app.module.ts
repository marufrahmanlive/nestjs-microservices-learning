import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';
import { HealthModule } from './health/health.module';

/**
 * 📦 AppModule — The ROOT Module
 *
 * Think of this as the "main electrical panel" of a building.
 * Every feature (room) connects to it.
 *
 * What it does:
 * 1. ConfigModule — loads .env file so all modules can access env vars
 * 2. MongooseModule — connects to MongoDB Atlas using the MONGODB_URI from .env
 * 3. BooksModule — our Books CRUD feature
 * 4. HealthModule — health check endpoint for monitoring
 */
@Module({
  imports: [
    // WHY ConfigModule.forRoot()?
    // It loads the .env file and makes process.env available everywhere
    // isGlobal: true means we don't need to import ConfigModule in every module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // WHY MongooseModule.forRootAsync()?
    // We use "async" because we need to INJECT ConfigService first,
    // then read the MONGODB_URI from it. The normal forRoot() can't
    // access ConfigService because it runs before ConfigModule is ready.
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    BooksModule,
    HealthModule,
  ],
})
export class AppModule {}
