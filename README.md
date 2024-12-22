# BookHive

BookHive is a web application that allows users to browse and order books online. The platform enables users to create accounts, log in, add books to their cart, and place orders seamlessly.

## Features

- **User Authentication**: Secure sign-up and login functionality with password encryption using bcrypt.
- **Browse Books**: Users can explore a variety of books across multiple genres.
- **Add to Cart**: Add books to the cart and review them before placing an order.
- **Order Placement**: Submit orders with detailed address and payment information.
- **Order Confirmation**: View order confirmation details after successful placement.
- **Backend API**: Robust backend built with Node.js and Express.
- **Database**: MongoDB is used to store user details, orders, and book information.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Security**: Password encryption with bcrypt and JSON Web Token (JWT) for authentication.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Access the application at `http://localhost:5000`.

## API Endpoints

### User Authentication

- **POST /signup**: Register a new user.

  ```json
  {
    "username": "JohnDoe",
    "mobile": "1234567890",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

- **POST /login**: Log in an existing user.

  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

### Orders

- **POST /submit-order**: Submit a new book order.

  ```json
  {
    "name": "John Doe",
    "Ordermobile": "1234567890",
    "Orderemail": "johndoe@example.com",
    "add": "123 Main Street",
    "pincode": 123456,
    "state": "California",
    "paytype": "Credit Card",
    "items": ["book1", "book2"],
    "cost": 500
  }
  ```

- **POST /verify**: Verify the user token.

  ```json
  {
    "token": "<jwt-token>"
  }
  ```

## Known Issues

- Inline event handlers may conflict with CSP if strict policies are applied.
- Ensure the MongoDB URI and JWT secret are configured correctly.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## License

This project is licensed under the MIT License.

