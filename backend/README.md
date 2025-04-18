# Project Overview

This project is organized into several directories and files, each serving a specific purpose. Below is an overview of the structure and the functionality of key components.

## src/
The main source code directory containing all application logic.

- **app.ts**: The entry point for the application, where the server is initialized and middleware is applied.
- **server.ts**: Contains the server configuration and setup, including port settings and connection to the database.

## config/
Configuration files for the application.

- **db.ts**: Database connection settings and initialization.
- **email.ts**: nodeMailer setup to send mail.
- **envConfig.ts**: it creates environmental variable with validation.

## controllers/
Contains the logic for handling requests and responses.

- **auth.controller.ts**: Handles authentication-related requests, such as login and registration.

## middlewares/auth
Middleware functions for request processing.

- **auth.middleware.ts**: Middleware for authentication checks.
- **error.middleware.ts**: Middleware for handling errors.

## models/
Data models for the application.

- **user.model.ts**: Defines the user data structure and schema.

## routes/
API route definitions.

- **auth.routes.ts**: Defines routes related to authentication, such as registration and login.

## services/
Business logic and service layer.

- **auth.service.ts**: Contains functions related to authentication processes.

## tests/
Contains test files for the application to ensure functionality and reliability.

# Features
- User authentication (registration and login)
- Middleware for error handling and validation
- Logging setup for monitoring application behavior

# Installation
1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`

# Running the Application
1. Start the server: `npm run start:dev`
2. The application will be running on `http://localhost:<port>`.

# Testing
1. Run tests: `npm run test`
2. Ensure all tests pass to verify functionality.

# Usage
- Use tools like Postman or curl to interact with the API endpoints defined in `auth.routes.ts`.

# Contributing
- Contributions are welcome! Please submit a pull request or open an issue for discussion.

# FAQ
- **How do I reset my password?**
  - Use the password reset endpoint provided in the API documentation.

- **What should I do if I encounter an error?**
  - Check the logs for more information and ensure that all dependencies are correctly installed.
