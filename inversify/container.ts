import { Container } from 'inversify';
import TYPES from './types';
import { IBookService } from '../services/bookService';
import { BookService } from '../services/bookService';
import { buildProviderModule } from 'inversify-binding-decorators';
import { IRepository } from '../repositories/IRepository';
import { Book } from '../models/Book';
import { BookRepository } from '../repositories/bookRepository';

const container = new Container();

// Repositories
container.bind<IRepository<Book>>(TYPES.BookRepository).to(BookRepository).inTransientScope();

// Services
container.bind<IBookService>(TYPES.BookService).to(BookService).inTransientScope();

container.load(buildProviderModule());

export default container;