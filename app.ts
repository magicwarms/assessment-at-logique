import express from 'express';

import 'reflect-metadata';
import connectDB from './database';

import setupSwagger from './config/swagger';
import morganMiddleware from './middlewares/morganMiddleware';
import logger from './logger';
import { Config } from "./config";

import contactRoutes from './routes/contactRoutes';

import container from './inversify/container';
import TYPES from './inversify/types';
import { logPayloadMiddleware } from './middlewares/logPayloadMiddleware';



// Connect to the database
connectDB();

const app = express();

const main = async () => {
    // Middleware to parse incoming JSON requests
    app.use(express.json());

    // Setup Morgan for request logging
    app.use(morganMiddleware);
    app.use(logPayloadMiddleware);

    app.use('/api/contacts', contactRoutes(container.get(TYPES.ContactService)));


    // Setup Swagger
    if (Config.ENVIRONMENT !== 'production') {
        setupSwagger(app);
    }
};

main().catch((error) => {
    logger.error('Failed to start the application:', error);
    process.exit(1);
});

export default app;