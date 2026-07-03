import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/**
 * 🎮 BooksController — HTTP Request Handler
 *
 * Each method below handles ONE HTTP endpoint.
 * The decorators tell NestJS:
 * - @Controller('books') → ALL routes in this class start with /books
 * - @Get()              → handles GET requests
 * - @Post()             → handles POST requests
 * - @Patch(':id')       → handles PATCH requests with an ID parameter
 * - @Delete(':id')      → handles DELETE requests with an ID parameter
 *
 * Full URL mapping:
 * GET    /books      → findAll()
 * GET    /books/:id  → findOne()
 * POST   /books      → create()
 * PATCH  /books/:id  → update()
 * DELETE /books/:id  → remove()
 */
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // @Param('id') extracts the :id from the URL
    // Example: GET /books/507f1f77bcf86cd799439011 → id = "507f1f77bcf86cd799439011"
    return this.booksService.findOne(id);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    // @Body() extracts the JSON body from the request
    // ValidationPipe automatically validates it against CreateBookDto rules
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
