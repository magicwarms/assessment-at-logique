# Assessment at Logique

# Book Management API

## Description

Book Management API is a RESTful API built with Node.js, Express, and TypeORM. It provides a set of endpoints for managing books, including creating, reading, updating, and deleting book data.

## Features

* Book management: Create, read, update, and delete book data
* API documentation: Swagger UI documentation available at `http://localhost:9000/`
* Database: PostgreSQL database using TypeORM
* Caching: Redis caching for improved performance

## Installation

1. Install dependencies: `npm install`
3. Create a PostgreSQL database and update the `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD` environment variables in `.env` file
4. Start the server: `npm run dev`

## Run unit test
```text
npm run test
```

## Run the app using docker
```docker
docker compose up
```

## API Endpoints

* `GET /books`: Get all books
* `GET /books/:id`: Get a book by ID
* `GET /books?search=Tommy&page=1&limit=10`: Get all books by search filter
* `POST /books`: Create a new book
* `PUT /books/:id`: Update a book
* `DELETE /books/:id`: Delete a book

## API Documentation

You can find the API documentation at `http://localhost:9000` or on Postman `https://documenter.getpostman.com/view/1357220/2sAXxJiF2g`

## License

This project is licensed under the [MIT License](LICENSE).
