import { Router, Request, Response } from 'express';
import { IBookService } from '../services/bookService';
import logger from '../logger';
import { CreateOrUpdateBookRequest } from '../dto/createOrUpdateBookRequest';
import { CreateBookSchema } from '../validation-schemas/createBookSchema';

const bookRoutes = (bookService: IBookService) => {
    const router = Router();

    /**
     * @openapi
     * components:
     *   schemas:
     *     Book:
     *       type: object
     *       required:
     *         - title
     *         - author
     *         - publishedYear
     *         - genres
     *         - stock
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated ID of the book
     *         name:
     *           type: string
     *           description: The name from the user input
     *         author:
     *           type: string
     *           description: The author from the user input
     *         publishedYear:
     *           type: number
     *           description: The publishedYear from the user input
     *         genres:
     *           type: array
     *           description: The genres from the user input
     *         stock:
     *           type: number
     *           description: The stock from the user input
     *       example:
     *         id: 1c341ec3-bb85-123a-ct62-7f67d358dr54
     *         title: The Lord of the Rings
     *         author: J.R.R. Tolkien
     *         publishedYear: 1954
     *         genres: [Fantasy, Adventure]
     *         stock: 10
     * 
     */

    /**
     * @openapi
     * tags:
     *   name: Books
     *   description: The book managing API
     */

    /**
     * @openapi
     * /api/books:
     *   post:
     *     summary: Create a new book
     *     tags: [Books]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Book'
     *     responses:
     *       201:
     *         description: The book was successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       500:
     *         description: Some server error
     */
    router.post('/', async (req: Request, res: Response) => {
        try {
            const data = req.body as CreateOrUpdateBookRequest;

            const { error } = CreateBookSchema.validate(data);

            if (error) {
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                logger.error(`Error message: ${errorMessage}, Incoming request: ${req.method} ${req.url}, Body: ${JSON.stringify(req.body)}`);
                return res.status(400).json({ message: errorMessage });
            }

            const newBook = await bookService.createBook(data);
            return res.status(201).json(newBook);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
                return res.status(500).json({ message: error.message });
            } else {
                logger.error("Unknown error occurred");
                return res.status(500).json({ message: 'Unknown error occurred' });
            }
        }
    });

    /**
     * @openapi
     * /api/books:
     *   get:
     *     summary: Get all books
     *     tags: [Books]
     *     parameters:
     *       - name: search
     *         in: query
     *         schema:
     *           type: string
     *         description: Search conditions; e.g., author_contains_john; title_contains_john
     *       - name: page
     *         in: query
     *         schema:
     *           type: integer
     *         description: Page number
     *       - name: limit
     *         in: query
     *         schema:
     *           type: integer
     *         description: Number of books per page
     *     responses:
     *       200:
     *         description: The list of filtered books
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *             items:
     *               $ref: '#/components/schemas/Book'
     *       500:
     *         description: Some server error
     */
    router.get('/', async (req: Request, res: Response) => {
        try {
            const searchStr = req.query.search as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (!searchStr) {
                const books = await bookService.getAllBooks();
                return res.status(200).json(books);
            }

            const [books, total] = await bookService.getAllBooksByCondition(searchStr, page, limit);
            return res.status(200).json({
                page,
                totalPages: Math.ceil(total / limit),
                totalBooks: total,
                books
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
                return res.status(500).json({ message: error.message });
            } else {
                logger.error("Unknown error occurred");
                return res.status(500).json({ message: 'Unknown error occurred' });
            }
        }
    });

    /**
     * @openapi
     * /api/books/:id:
     *   get:
     *     summary: Get book by id
     *     tags: [Books]
     *     responses:
     *       200:
     *         description: The book
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *             items:
     *               $ref: '#/components/schemas/Book'
     *       500:
     *         description: Some server error
     */
    router.get('/:id', async (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ message: 'Id is required' });
            }

            const books = await bookService.getBookById(req.params.id)
            return res.status(200).json(books);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
                return res.status(404).json({ message: error.message });
            } else {
                logger.error("Unknown error occurred");
                return res.status(500).json({ message: 'Unknown error occurred' });
            }
        }
    });

    /**
     * @openapi
     * /api/books/:id:
     *   put:
     *     summary: Update book information by id
     *     tags: [Books]
     *     responses:
     *       200:
     *         description: The updated book
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *             items:
     *               $ref: '#/components/schemas/Book'
     *       500:
     *         description: Some server error
     */
    router.put('/:id', async (req: Request, res: Response) => {
        try {
            const data = req.body as CreateOrUpdateBookRequest;
            const { error } = CreateBookSchema.validate(data);

            if (error) {
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                logger.error(`Error message: ${errorMessage}, Incoming request: ${req.method} ${req.url}, Body: ${JSON.stringify(req.body)}`);
                return res.status(400).json({ message: errorMessage });
            }

            const books = await bookService.updateBook(req.params.id, data)
            return res.status(200).json(books);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
                return res.status(404).json({ message: error.message });
            } else {
                logger.error("Unknown error occurred");
                return res.status(500).json({ message: 'Unknown error occurred' });
            }
        }
    });

    /**
     * @openapi
     * /api/books/:id:
     *   delete:
     *     summary: Delete book information by id
     *     tags: [Books]
     *     responses:
     *       200:
     *         description: Book deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *             items:
     *               type: string
     *       500:
     *         description: Some server error
     */
    router.delete('/:id', async (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ message: 'Id is required' });
            }

            await bookService.deleteBook(req.params.id)
            return res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
                return res.status(404).json({ message: error.message });
            } else {
                logger.error("Unknown error occurred");
                return res.status(500).json({ message: 'Unknown error occurred' });
            }
        }
    });

    return router;

}

export default bookRoutes;