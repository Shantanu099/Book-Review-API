# Book Review API

A RESTful API built with Node.js and Express for managing books and their reviews.

## Features

- User authentication using JWT
- Book management (CRUD operations)
- Review system with one review per user per book
- Search functionality for books
- Pagination support
- Input validation
- Error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Express Validator for input validation

## Schema Design

### User Schema

{
id: ObjectId,
email: String (unique),
password: String,
createdAt: Date,
updatedAt: Date
}

### Book Schema

{
id: ObjectId,
title: String,
author: String,
genre: String,
description: String,
averageRating: Number,
createdAt: Date,
updatedAt: Date
}

### Review Schema

{
id: ObjectId,
bookId: ObjectId (ref: 'Book'),
userId: ObjectId (ref: 'User'),
rating: Number (1-5),
createdAt: Date,
updatedAt: Date
}

## Relationships

1. User to Review (1:N)
   - One user can create multiple reviews
   - Each review for a book must belong to exactly one user

2. Book to Review (1:N)
   - One book can have multiple reviews
   - Each review must belong to exactly one book
   - A book can exist without any reviews

3. User to Book (M:N)
   - Implemented through the Review entity
   - One user can review multiple books
   - One book can be reviewed by multiple users
   - Maximum one review per user per book

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   npm install

3. Create a .env file in the root directory with the following variables:
   PORT=3001
   MONGODB_URI="mongodb+srv://shantanu:shantanu@cluster0.cepaz5r.mongodb.net/book-review-api"
   JWT_SECRET=HFSJFHSKFHSHFSF151661

4. Start the development server:
   npm run dev

## API Endpoints

### Authentication

- POST /signup
- Register a new user
  curl --location 'http://localhost:3001/signup' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "email": "testing@gmail.com",
  "password": "password123"
  }'

- POST /login
- Authenticate user and get token
  curl --location 'http://localhost:3001/login' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "email": "anmol@gmail.com",
  "password": "password123"
  }'

### Books

- POST /books

  - Add a new book (requires authentication)
    curl --location 'http://localhost:3001/books' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDQ0MzYyM2IxYjllMDlkYWVjZjczZSIsImlhdCI6MTc0OTMwNDE4MSwiZXhwIjoxNzQ5OTA4OTgxfQ.Qdy6K0_9zaoO-PDIUG044USfJQt-VYi2gtVvVKyyLsg' \
    --header 'Content-Type: application/json' \
    --data '{
    "title": "simple book",
    "author": "Author",
    "genre" : "non-fiction",
    "description": "Sample Description"
    }'

  - GET /books
  - Get all books (with pagination)
    curl --location 'http://localhost:3001/books?page=1&limit%20=%2010&author=Sample%20author&gener=comic'

  - GET /books/:bookId
  - Get book details by ID
    curl --location 'http://localhost:3001/books/684402f2ff9c8133e853332d'

### Reviews

- POST /books/:id/reviews

  - Submit a review (requires authentication)
  - POST /books/:bookId/reviews
    curl --location 'http://localhost:3001/books/684402f2ff9c8133e853332d/reviews' \
     --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDQ0MzYyM2IxYjllMDlkYWVjZjczZSIsImlhdCI6MTc0OTMwNDE4MSwiZXhwIjoxNzQ5OTA4OTgxfQ.Qdy6K0_9zaoO-PDIUG044USfJQt-VYi2gtVvVKyyLsg' \
     --header 'Content-Type: application/json' \
     --data '{
    "rating" : 5
    }'

  - PUT reviews/:reviewId
  - Update a review (requires authentication)
    curl --location --request PUT 'http://localhost:3001/reviews/68443871255eacef205c4078' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDQ0MzYyM2IxYjllMDlkYWVjZjczZSIsImlhdCI6MTc0OTMwNDE4MSwiZXhwIjoxNzQ5OTA4OTgxfQ.Qdy6K0_9zaoO-PDIUG044USfJQt-VYi2gtVvVKyyLsg' \
    --header 'Content-Type: application/json' \
    --data '{
    "rating" : 3
    }'

  - DELETE /reviews/:reviewId
    curl --location --request DELETE 'http://localhost:3001/reviews/68442d0f59fbeade33ca9a7f' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDNlZjQwMjY2YzZhM2JjNmQzMDk5NSIsImlhdCI6MTc0OTI5MzY0OSwiZXhwIjoxNzQ5ODk4NDQ5fQ.YPCBCaT_t6GJhgiKfRGx0XELfY4VX0VKWuFINmldQ9o' \
    --data ''

### Search

- GET /books/search
  - Search books by title or author
    curl --location 'http://localhost:3001/books/search?q=b'

## Development

To run the development server:
npm run dev

ER Diagram
![image](https://github.com/user-attachments/assets/4e1324b6-be26-4aa5-88ae-9df8f10161bf)
