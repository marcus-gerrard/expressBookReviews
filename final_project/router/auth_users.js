const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {"username": "marcus", "password": 'pass'}
];

const isValid = (username)=>{ //returns boolean
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return false;
  } else {
      return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUser = users.filter((user) => {
    return user.username === username && user.password === password
  });

  if (validUser.length > 0) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error Logging In"})
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
  }, 'access', { expiresIn: 60 * 600 });

  // Store access token and username in session
  req.session.authorization = {
      accessToken, username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.user;
  let review = req.query.review;

  if (!review) {
    return res.send('No Review Given')
  }

  if (!isbn) {
    return res.send('No ISBN Given')
  }

  const username = req.session['authorization']['username']

  const book = books[isbn]
  book['reviews'][username] = review

  return res.status(200).send("Review Successfully Added: " + JSON.stringify(book['reviews']));
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.user;

  if (!isbn) {
    return res.send('No ISBN Given')
  }

  const username = req.session['authorization']['username']

  const book = books[isbn]
  
  delete book['reviews'][username]

  return res.status(200).send("Review Successfully Deleted: " + JSON.stringify(book['reviews']));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
