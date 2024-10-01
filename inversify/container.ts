import { Container } from 'inversify';
import TYPES from './types';
import { IContactService } from '../services/bookService';
import { ContactService } from '../services/bookService';
import { buildProviderModule } from 'inversify-binding-decorators';
import { IRepository } from '../repositories/IRepository';
import { Book } from '../models/Book';
import { BookRepository } from '../repositories/bookRepository';

const container = new Container();

// Repositories
container.bind<IRepository<Book>>(TYPES.BookRepository).to(BookRepository).inTransientScope();

// Services
container.bind<IContactService>(TYPES.BookService).to(ContactService).inTransientScope();

container.load(buildProviderModule());

export default container;