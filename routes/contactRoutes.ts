import { Router, Request, Response } from 'express';
import { IContactService } from '../services/bookService';
import logger from '../logger';
import CreateContactMessageRequest from '../dto/createContactMessageRequest';
import { CreateContactMessageSchema } from '../validation-schemas/createContactMessageSchema';

const contactRoutes = (contactService: IContactService) => {
    const router = Router();

    /**
     * @openapi
     * components:
     *   schemas:
     *     Contact:
     *       type: object
     *       required:
     *         - name
     *         - email
     *         - message
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated ID of the message
     *         name:
     *           type: string
     *           description: The name from the user input
     *         email:
     *           type: string
     *           description: The email from the user input
     *         message:
     *           type: string
     *           description: The message from the user input
     *         createdDate:
     *           type: string
     *           format: date-time
     *           description: The date when the message was created
     *         createdBy:
     *           type: string
     *           description: CreatedBy User
     *         updatedDate:
     *           type: string
     *           format: date-time
     *           description: The date when the user was last updated
     *         updatedBy:
     *           type: string
     *           description: UpdatedBy User
     *         deletedDate:
     *           type: string
     *           format: date-time
     *           description: The date when the user was deleted (if applicable)
     *         deletedBy:
     *           type: string
     *           description: DeletedBy User
     *       example:
     *         id: 1c341ec3-bb85-123a-ct62-7f67d358dr54
     *         name: John Doe
     *         email: johndoe@example.com
     *         message: hello world!
     *         createdDate: 2021-05-25T09:12:33.001Z
     *         createdBy: John Doe | johndoe@example.com
     *     CreateContactMessage:
     *       type: object
     *       required:
     *         - name
     *         - email
     *         - message
     *       properties:
     *         name:
     *           type: string
     *           description: The name from the user input
     *         email:
     *           type: string
     *           description: The email from the user input
     *         message:
     *           type: string
     *           description: The message from the user input
     *       example:
     *         name: John Doe
     *         email: johndoe@example.com
     *         message: hello everyone! I need help!
     */

    /**
     * @openapi
     * tags:
     *   name: Contacts
     *   description: The contact managing API
     */


    /**
     * @openapi
     * /api/contacts:
     *   post:
     *     summary: Create a new message
     *     tags: [Contacts]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateContactMessage'
     *     responses:
     *       201:
     *         description: The message was successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Contact'
     *       500:
     *         description: Some server error
     */
    router.post('/', async (req: Request, res: Response) => {
        try {
            const data = req.body as CreateContactMessageRequest;

            const { error } = CreateContactMessageSchema.validate(data);

            if (error) {
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                logger.error(`Error message: ${errorMessage}, Incoming request: ${req.method} ${req.url}, Body: ${JSON.stringify(req.body)}`);
                return res.status(400).json({ message: errorMessage });
            }

            const newMessage = await contactService.createContactMessage(data);
            return res.status(201).json(newMessage);
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

export default contactRoutes;