import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/book.schema';

/**
 * 📚 BooksModule — Feature Module
 *
 * WHY a separate module?
 * NestJS modules are like LEGO blocks — each one is self-contained.
 * This makes the app organized and easy to scale.
 * If we later add "Authors" or "Categories", they'd each have their own module.
 *
 * What this module does:
 * 1. Registers the Book schema with Mongoose (so we can use it)
 * 2. Registers the controller (handles HTTP requests)
 * 3. Registers the service (handles business logic)
 */
@Module({
  imports: [
    // WHY MongooseModule.forFeature()?
    // This tells Mongoose: "Hey, the 'Book' schema exists and
    // I want to use it in THIS module."
    //
    // It's different from forRoot() in AppModule which ESTABLISHES the connection.
    // forFeature() REGISTERS individual schemas/models.
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
