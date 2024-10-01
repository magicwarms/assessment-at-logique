import { inject, injectable } from 'inversify';
import { Book } from '../models/Book';
import { IRepository } from '../repositories/IRepository';
import TYPES from '../inversify/types';

import { BookDTO } from '../dto/bookDTO';

export interface IBookService {
    createBook(book: BookDTO): Promise<Book>;
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

        return createdBook;

    }
}