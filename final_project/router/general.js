const axios = require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });
    } else {
      return res.status(404).json({
        message: "User already exists"
      });
    }
  }

  return res.status(404).json({
    message: "Username and password are required"
  });
});

// Get all books using Axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book" });
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');

        const filteredBooks = Object.values(response.data).filter(
            book => book.author.toLowerCase() === req.params.author.toLowerCase()
        );

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found for this author" });
        }

        res.status(200).json(filteredBooks);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by author" });
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');

        const filteredBooks = Object.values(response.data).filter(
            book => book.title.toLowerCase() === req.params.title.toLowerCase()
        );

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }

        res.status(200).json(filteredBooks);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
