# Book Exchange Platform

## Overview

The Book Exchange Platform is a web application that allows users to list books they want to exchange, browse books listed by others, and initiate book exchanges based on their preferences. The platform includes user authentication, book management, exchange request handling, and a basic matching algorithm.

## Features

- **User Authentication**: Secure registration, login, and logout functionality.
- **Book Management**: List, edit, and remove books available for exchange.
- **Book Discovery**: Browse and filter books listed by other users.
- **Matchmaking**: View potential exchange matches based on book preferences.
- **Exchange Requests**: Send and receive exchange requests.
- **Request Cancellation**: Cancel pending requests when an exchange is accepted.

## Technology Stack

- **Frontend**: React.js, Tailwind CSS, ChakraUI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Render

## Deployment Link
[Live Link](https://book-exchange-platform-1.onrender.com/)  
[Backend Deployment](https://book-exchange-platform-vf2q.onrender.com/)

[Postman APIs Link](https://www.postman.com/dark-eclipse-727260/workspace/book-management-system)

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/register`
  - Registers a new user.
  - **Request Body**: `{ "username": "string", "password": "string" }`
  - **Response**: `{ "msg": "User registered successfully", "token": "jwt_token" }`

- **POST** `/api/v1/auth/login`
  - Logs in a user and returns a JWT token.
  - **Request Body**: `{ "username": "string", "password": "string" }`
  - **Response**: `{ "msg": "Login successful", "token": "jwt_token" }`

- **GET** `/api/v1/auth/user`
  - Retrieves the current user's profile.
  - **Response**: `{ "user": { "username": "string", "books": [ "book_ids" ] } }`

- **POST** `/api/v1/auth/logout`
  - Logs out the user.

### Books

- **POST** `/api/v1/books`
  - Lists a new book for exchange.
  - **Request Body**: `{ "title": "string", "author": "string", "genre": "string", "description": "string" }`
  - **Response**: `{ "book": { "title": "string", "author": "string", "genre": "string", "description": "string", "owner": "user_id" } }`

- **GET** `/api/v1/books`
  - Retrieves books listed by other users.
  - **Query Parameters**: `genre`, `author`
  - **Response**: `{ "books": [ "book_list" ], "authors": [ "author_list" ], "genres": [ "genre_list" ] }`

- **GET** `/api/v1/books/user`
  - Retrieves the books listed by the current user.
  - **Query Parameters**: `genre`, `author`
  - **Response**: `{ "books": [ "book_list" ], "authors": [ "author_list" ], "genres": [ "genre_list" ] }`

- **PUT** `/api/v1/books/:id`
  - Edits a listed book.
  - **Request Body**: `{ "title": "string", "author": "string", "genre": "string", "description": "string" }`
  - **Response**: `{ "book": { "title": "string", "author": "string", "genre": "string", "description": "string" } }`

- **DELETE** `/api/v1/books/:id`
  - Deletes a listed book.
  - **Response**: `{ "message": "Book removed" }`

### Exchange Requests

- **POST** `/api/v1/exchange-requests`
  - Creates a new exchange request.
  - **Request Body**: `{ "requestedBookId": "book_id", "offeredBookId": "book_id" }`
  - **Response**: `{ "message": "Exchange request created", "exchangeRequest": { "requester": "user_id", "requestedBook": "book_id", "offeredBook": "book_id", "status": "pending" } }`

- **GET** `/api/v1/exchange-requests`
  - Retrieves incoming exchange requests.
  - **Response**: `{ "requests": [ "request_list" ] }`

- **GET** `/api/v1/exchange-requests/sent`
  - Retrieves sent exchange requests.
  - **Response**: `{ "requests": [ "request_list" ] }`

- **POST** `/api/v1/exchange-requests/:id/accept`
  - Accepts an exchange request.
  - **Response**: `{ "message": "Exchange request accepted", "exchangeRequest": { "requester": "user_id", "requestedBook": "book_id", "offeredBook": "book_id", "status": "accepted" } }`

- **POST** `/api/v1/exchange-requests/:id/decline`
  - Declines an exchange request.
  - **Response**: `{ "message": "Exchange request rejected", "exchangeRequest": { "requester": "user_id", "requestedBook": "book_id", "offeredBook": "book_id", "status": "rejected" } }`

## Database Integration

- **Users**: Stores user information and associated books.
- **Books**: Stores book details and ownership.
- **Exchange Requests**: Manages exchange requests between users.
- 

### Project Setup

To set up the project, follow these steps:
- Clone Repo, install dependencies
- Copy the `.env.example` environment file to create your own `.env` files for both the server and client
- Start server
