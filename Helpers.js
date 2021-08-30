const bcrypt = require("bcryptjs");

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

const urlDatabase = {
  "b2xVn2": {
    longURL: "https://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "https://www.google.com",
    userID: "user2RandomID"
  }
};

//Takes in email and looks through userDatabase to find if it's already used, then returns it. If not, it returns null
const findUser = function(userDatabase, email) {
  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return null;
};

//Takes in email and password and returns valid user
const verify = (email, password) => {
  const user = findUser(userDatabase, email);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return undefined;
};

//Takes in userID, looks through urlDatabase and returns URLs with your userID
const userURLs = function(userID) {
  let filteredUrls = {};
  for (urlID in urlDatabase) {
    if (urlDatabase[urlID].userID === userID) {
      filteredUrls[urlID] = urlDatabase[urlID];
    }
  }
  return filteredUrls;
}

module.exports = { userDatabase, urlDatabase, findUser, verify, userURLs };
