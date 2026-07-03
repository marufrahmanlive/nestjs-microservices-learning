import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/**
 * 🏗️ BooksService — Business Logic Layer
 *
 * WHY a separate service?
 * Separation of Concerns: The controller handles HTTP stuff (requests, responses),
 * the service handles BUSINESS LOGIC (database operations, calculations).
 * This makes code easier to test and maintain.
 *
 * The controller says "WHAT" (GET /books)
 * The service says "HOW"  (find all books in MongoDB)
 */
@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    // WHY @InjectModel?
    // This tells NestJS: "Give me the Mongoose Model for the Book schema"
    // So we can do database operations like find(), create(), etc.
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  /**
   * 📚 GET /books
   * Returns ALL books from the database
   */
  async findAll(): Promise<Book[]> {
    this.logger.log('Finding all books');
    return this.bookModel.find().exec();
  }

  /**
   * 📖 GET /books/:id
   * Returns ONE book by its MongoDB ID
   *
   * If the book doesn't exist, we throw NotFoundException
   * which automatically returns a 404 response
   */
  async findOne(id: string): Promise<Book> {
    this.logger.log(`Finding book with id: ${id}`);

    const book = await this.bookModel.findById(id).exec();

    if (!book) {
      // NestJS automagically converts this to HTTP 404
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    return book;
  }

  /**
   * ➕ POST /books
   * Creates a NEW book in the database
   */
  async create(createBookDto: CreateBookDto): Promise<Book> {
    this.logger.log(`Creating book: ${createBookDto.title}`);

    const newBook = new this.bookModel(createBookDto);
    return newBook.save(); // save() actually writes to MongoDB
  }

  /**
   * ✏️ PATCH /books/:id
   * Updates an existing book
   *
   * { new: true } tells Mongoose to return the UPDATED document
   * instead of the OLD one
   */
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    this.logger.log(`Updating book with id: ${id}`);

    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();

    if (!updatedBook) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    return updatedBook;
  }

  /**
   * 🗑️ DELETE /books/:id
   * Removes a book from the database
   */
  async remove(id: string): Promise<{ message: string }> {
    this.logger.log(`Deleting book with id: ${id}`);

    const result = await this.bookModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    // We return a message object instead of the deleted book
    return { message: 'Book deleted successfully' };
  }
}
