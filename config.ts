import 'dotenv/config'

export const Config = {
    PORT: process.env.PORT ?? 9000,
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: process.env.DB_PORT ?? 5432,
    DB_USERNAME: process.env.DB_USERNAME ?? 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_NAME: process.env.DB_NAME ?? 'booksdb',
    DB_SSL: process.env.DB_SSL ?? false,
    ENVIRONMENT: process.env.NODE_ENV,
    REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ?? 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? '',

    CACHE_TTL: process.env.CACHE_TTL ?? 3600,

};