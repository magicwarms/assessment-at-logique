import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Management API',
            version: '1.0.0',
            description: 'API documentation for Book Management',
        },
        servers: [
            {
                url: 'http://localhost:9000', // Update with your API's base URL
            },
        ],
    },
    apis: ['./routes/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app: Express) => {
    app.use('/', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;