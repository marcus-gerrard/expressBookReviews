const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password})
      return res.send('User Successfully Registered')
    } else {
      return res.send('Username Already Exists')
    }
  } else {
    return res.send('Username or Password not provided')
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let book = books[isbn]
  if (book) {
    return res.send(JSON.stringify(book))
  } else {
    return res.send("Book Not Found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const keys = Object.keys(books)

  keys.forEach(key => {
    let book = books[key]
    if (book.author === author){
      return res.send(JSON.stringify(book))
    }
  });

  return res.send("No Books with Author: " + author)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const keys = Object.keys(books)

  keys.forEach(key => {
    let book = books[key]
    if (book.title === title){
      return res.send(JSON.stringify(book))
    }
  });

  return res.send("No Books with Title: " + title)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let book = books[isbn]
  if (book) {
    return res.send(JSON.stringify(book.reviews))
  }
  return res.send("No Book With ISBN: " + isbn);
});

module.exports.general = public_users;
