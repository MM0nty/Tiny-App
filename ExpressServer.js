const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { request, response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
const { Template } = require("ejs");
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca" },
  "9sm5xK": { longURL: "http://www.google.com" }
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

const findUser = function (userDatabase, email) {
  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return null;
};

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, response) => {
  const template = { urls: urlDatabase, email: request.cookies["email"] };
  response.render("Index", template);
});

app.post("/urls", (request, response) => {
  const longURL = request.body.longURL;
  const userID = request.cookies.userID;
  const shortURL = Math.random().toString(36).slice(2, 8);
  const newURL = { longURL, userID };
  urlDatabase[shortURL] = newURL;
  console.log("urlDatabase:", urlDatabase);
  response.redirect("/urls/" + shortURL);
});

app.get("/urls/new", (request, response) => {
  const template = { email: request.cookies["email"] };
  if (!request.cookies["email"]) {
    response.redirect("/login");
  }
  response.render("New", template);
});

app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];
  response.redirect(longURL);
});

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL].longURL/* What goes here? */, email: request.cookies["email"] };
  response.render("Show", template);
});

app.post("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = request.body.longURL;
  urlDatabase[shortURL] = longURL;
  const template = { email: request.cookies["email"] };
  response.render("Index", template);
});

app.post("/urls/:shortURL/delete", (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.render("Index", template);
});

app.get("/register", (request, response) => {
  const template = { email: request.cookies["email"] };
  // const template = { email: request.session.email };
  response.render("Register", template);
});

app.post("/register", (request, response) => {
  const { email, password } = request.body;
  const user = findUser(userDatabase, email);
  if (email === "" || password === "" || user) {
    response.status(400).send("Registration failed. Error code 400");
  }
  const userID = Math.random().toString(36).slice(2, 8);
  const newUser = { userID, email, password };
  userDatabase[userID] = newUser;
  response.cookie("email", email);
  response.cookie("userID", userID);
  console.log(userDatabase);
  response.redirect("/urls");
});

app.get("/login", (request, response) => {
  const template = { email: request.cookies["email"] };
  response.render("Login", template);
});

app.post("/login", (request, response) => {
  const { email, password } = request.body;
  const user = findUser(userDatabase, email);
  if (password !== user.password) {
    response.status(403).send("Login failed. Error code 403");
  }
  if (user && password === user.password) {
    response.cookie("email", email);
    response.cookie("userID", user.userID);
  }
  response.redirect("/urls");
})

app.post("/logout", (request, response) => {
  response.clearCookie("email", "userID");
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});