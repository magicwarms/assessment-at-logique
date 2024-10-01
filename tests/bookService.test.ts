
import { Book } from '../models/Book';
import { IRepository } from '../repositories/IRepository';
import { BookService } from '../services/bookService';

// Mock UserRepository
const mockBookRepository: jest.Mocked<IRepository<Book>> = {
  getAll: jest.fn(),
  getAllByConditions: jest.fn(),
  getSingleById: jest.fn(),
  getSingleByConditions: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  getPageData: jest.fn(),
  countByConditions: jest.fn(),
};

describe('BookService', () => {
  let bookService: BookService;

  beforeEach(() => {
    // Create an instance of BookService with the mocked BookRepository
    bookService = new BookService(mockBookRepository);
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('Books', () => {
    it('should create and return a new book', async () => {
      const newBook: Book = {
        id: "04a13f6a-c0c7-4774-962c-1eadf26db2fc",
        title: "Terminator",
        author: "si Haha",
        publishedYear: 2000,
        genres: [
          "fantasy"
        ],
        stock: 10
      };

      // Mock the create method to return the newBook
      mockBookRepository.create.mockResolvedValue(newBook);

      const result = await bookService.createBook(newBook);

      expect(result).toEqual(newBook);
      expect(mockBookRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});