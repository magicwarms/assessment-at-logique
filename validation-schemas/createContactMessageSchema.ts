import Joi from 'joi';

// Define the schema using Joi
export const CreateContactMessageSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    message: Joi.string().required().min(10).max(255)
});