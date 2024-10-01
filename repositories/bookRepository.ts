import { injectable } from 'inversify';
import { Book } from '../models/Book';
import { BaseRepository } from './baseRepository';

@injectable()
export class BookRepository extends BaseRepository<Book> {
    constructor() {
        super(Book);
    }
    // Define any additional repository methods specific to User if needed
}