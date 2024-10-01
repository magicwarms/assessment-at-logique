import Joi from 'joi';

// Define the schema using Joi
export const CreateBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    publishedYear: Joi.number().required().min(4),
    genres: Joi.array().required(),
    stock: Joi.number().required().min(0)
});