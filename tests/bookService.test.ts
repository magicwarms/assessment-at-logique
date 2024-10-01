
import { CACHE_KEY } from '../constant/const';
import { Book } from '../models/Book';
import { IRepository } from '../repositories/IRepository';
import { BookService } from '../services/bookService';

// Mock UserRepository
const mockBookRepository: jest.Mocked<IRepository<Book>> = {
  getAll: jest.fn(),
  getAllByConditions: jest.fn(),
  getSingleById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn()
};

const book: Book = {
  id: "04a13f6a-c0c7-4774-962c-1eadf26db2fc",
  title: "Terminator",
  author: "si Haha",
  publishedYear: 2000,
  genres: [
    "fantasy"
  ],
  stock: 10
};

jest.mock('ioredis', () => {
  return jest.fn(() => {
    const redisMock = {
      del: (key: string) => {
        return key;
      },
      get: (key: string) => {
        if (key === `${CACHE_KEY.BOOK}all`) return JSON.stringify([book]);
        return JSON.stringify(book);
      },
      keys: async (key: string) => {
        return Promise.resolve([key]);
      }
    };
    return redisMock;
  });
});

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

    it('should get all books data', async () => {
      mockBookRepository.getAll.mockResolvedValue([book]);

      const results = await bookService.getAllBooks();

      expect(results).toEqual([book]);
      expect(results).toHaveLength(1);
    });

    it('should get book data by id', async () => {
      mockBookRepository.getSingleById.mockResolvedValue(book);

      const result = await bookService.getBookById(book.id);

      expect(result).toEqual(book);
    });

    it('should update and return a updated book', async () => {
      const updatedBook: Book = {
        id: "04a13f6a-c0c7-4774-962c-1eadf26db2fc",
        title: "Terminator updated",
        author: "si Haha",
        publishedYear: 2000,
        genres: [
          "fantasy"
        ],
        stock: 10
      };

      // Mock the create method to return the newBook
      mockBookRepository.update.mockResolvedValue(updatedBook);

      const result = await bookService.updateBook(updatedBook.id, updatedBook);

      expect(result).toEqual(updatedBook);
      expect(mockBookRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should delete and return success message', async () => {
      mockBookRepository.delete.mockResolvedValue();

      await bookService.deleteBook("04a13f6a-c0c7-4774-962c-1eadf26db2fc");

      expect(mockBookRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should get all books data by search filter', async () => {
      mockBookRepository.getAllByConditions.mockResolvedValue([[book], 1]);

      const [books, countBook] = await bookService.getAllBooksByCondition("Terminator", 1, 10);

      expect(books).toEqual([book]);
      expect(countBook).toEqual(1);
    });
  });
});