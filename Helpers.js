const bcrypt = require("bcryptjs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "null" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "null" }
};

const userDatabase = {
  "userRandomID": {
    userID: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    userID: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const identity = function() {
  return Math.random().toString(36).slice(2, 8);
}

//Takes in email and looks through userDatabase to find if it's already used, then returns it. If not, it returns null
const findUser = function(userDatabase, email) {
  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return null;
};

//Takes in userID, looks through urlDatabase and returns URLs with your userID
const userURLs = function(userID) {
  const filteredURLs = {};
  for (shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      filteredURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return filteredURLs;
};

module.exports = { userDatabase, urlDatabase, identity, findUser, userURLs };