import { inject, injectable } from 'inversify';
import { Book } from '../models/Book';
import { IRepository } from '../repositories/IRepository';
import TYPES from '../inversify/types';

import { BookDTO } from '../dto/bookDTO';
import redis from '../config/redis';
import { CACHE_KEY } from '../constant/const';
import { Config } from '../config';
import { ArrayContains, Like } from 'typeorm';

export interface IBookService {
    createBook(book: BookDTO): Promise<Book>;
    getAllBooks(): Promise<Book[]>
    getBookById(id: string): Promise<Book | null>;
    updateBook(id: string, book: BookDTO): Promise<Book>;
    deleteBook(id: string): Promise<void>;
    getAllBooksByCondition(
        search: string,
        page: number,
        limit: number
    ): Promise<[Book[], number]>;
}

@injectable()
export class BookService implements IBookService {
    private bookRepository: IRepository<Book>;

    constructor(
        @inject(TYPES.BookRepository) bookRepository: IRepository<Book>,
    ) {
        this.bookRepository = bookRepository;
    }

    async createBook(book: BookDTO): Promise<Book> {
        const { title, author, publishedYear, genres, stock } = book

        const bookData = new Book();

        bookData.title = title;
        bookData.author = author;
        bookData.publishedYear = publishedYear;
        bookData.genres = genres;
        bookData.stock = stock;

        const createdBook = await this.bookRepository.create(bookData);

        await this.invalidateCacheForSingleBook(createdBook);

        return createdBook;

    }

    async getAllBooks(): Promise<Book[]> {
        const cacheKey = `${CACHE_KEY.BOOK}all`;
        const cachedBooks = await redis.get(cacheKey);

        if (cachedBooks) return JSON.parse(cachedBooks);

        const books = await this.bookRepository.getAll();
        if (books) await redis.set(cacheKey, JSON.stringify(books), 'EX', Config.CACHE_TTL);

        return books;
    }

    async getBookById(id: string): Promise<Book> {
        const cacheKey = `${CACHE_KEY.BOOK}:id=${id}`;
        const cachedBook = await redis.get(cacheKey);

        if (cachedBook) return JSON.parse(cachedBook);

        const book = await this.bookRepository.getSingleById(id);
        if (!book) {
            throw new Error(`Book not found with id ${id}`);
        }

        await redis.set(cacheKey, JSON.stringify(book), 'EX', Config.CACHE_TTL);

        return book;
    }

    async updateBook(id: string, book: BookDTO): Promise<Book> {
        const { title, author, publishedYear, genres, stock } = book

        const getBook = await this.bookRepository.getSingleById(id);
        if (!getBook) throw new Error('Book not found');

        const updatedBook = await this.bookRepository.update({
            ...getBook,
            title,
            author,
            publishedYear,
            genres,
            stock
        });
        await this.invalidateCacheForSingleBook(updatedBook);
        return {
            id: updatedBook.id,
            title: updatedBook.title,
            author: updatedBook.author,
            publishedYear: updatedBook.publishedYear,
            genres: updatedBook.genres,
            stock: updatedBook.stock
        }

    }

    async deleteBook(id: string): Promise<void> {
        const getBook = await this.bookRepository.getSingleById(id);
        if (!getBook) throw new Error('Book not found');

        await this.invalidateCacheForSingleBook(getBook);

        return this.bookRepository.delete(id);
    }

    private async invalidateCacheForSingleBook(book: Book) {
        await redis.del(`${CACHE_KEY.BOOK}:id=${book.id}`);
        await redis.del(`${CACHE_KEY.BOOK}all`); // Invalidate cache for all books
        await redis.keys(`${CACHE_KEY.BOOK}${CACHE_KEY.PAGE}*`).then(keys => { keys.forEach(key => redis.del(key)); }); // Invalidate all page caches
    }

    async getAllBooksByCondition(
        search: string,
        page: number,
        limit: number
    ): Promise<[Book[], number]> {
        return this.bookRepository.getAllByConditions({
            where: [
                { title: Like(`%${search}%`) },
                { author: Like(`%${search}%`) },
                { genres: ArrayContains([search]) },
            ],
            skip: (page - 1) * limit,
            take: limit
        });
    }
}