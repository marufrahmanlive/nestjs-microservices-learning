import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/**
 * 🧪 BooksController Unit Tests
 *
 * WHY write tests?
 * 1. CATCH BUGS EARLY — before they reach production
 * 2. DOCUMENTATION — tests show how the code SHOULD behave
 * 3. CONFIDENCE — you can refactor without fear of breaking things
 * 4. CI/CD — automated tests run on every push to GitHub
 *
 * These tests MOCK the service — they DON'T connect to a real database.
 * This makes tests FAST and PREDICTABLE.
 */
describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  // Mock book data
  const mockBook = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Book',
    author: 'Test Author',
    year: 2024,
    description: 'A test book',
  };

  // Create a MOCK service that doesn't need a real database
  const mockBooksService = {
    findAll: jest.fn().mockResolvedValue([mockBook]),
    findOne: jest.fn().mockResolvedValue(mockBook),
    create: jest.fn().mockResolvedValue(mockBook),
    update: jest.fn().mockResolvedValue(mockBook),
    remove: jest.fn().mockResolvedValue({ message: 'Book deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockBook]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const result = await controller.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        year: 2024,
        description: 'A test book',
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const dto: UpdateBookDto = { title: 'Updated Title' };
      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        dto,
      );
      expect(result).toEqual(mockBook);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        dto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      const result = await controller.remove('507f1f77bcf86cd799439011');
      expect(result).toEqual({ message: 'Book deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
