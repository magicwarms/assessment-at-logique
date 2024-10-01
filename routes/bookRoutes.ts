import { Router, Request, Response } from 'express';
import { IBookService } from '../services/bookService';
import logger from '../logger';
import { CreateBookRequest } from '../dto/createBookRequest';
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
     *     CreateBook:
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
     *             $ref: '#/components/schemas/CreateBookRequest'
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
            const data = req.body as CreateBookRequest;

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

    return router;

}

export default bookRoutes;