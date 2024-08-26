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

[Postman APIs Link](https://www.postman.com/dark-eclipse-727260/workspace/book-management-system)
[Live Link](https://book-exchange-platform-vf2q.onrender.com/)
Create a Environment Variable `Cookie` with Cookie value to test APIs.

### Project Setup

To set up the project, follow these steps:

- Copy the `.env.example` environment file to create your own `.env` files for both the server and client
