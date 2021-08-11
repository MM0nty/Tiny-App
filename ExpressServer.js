const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const { userDatabase, findUser, verify } = require("./Helpers");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["key0"]
}));

app.set("view engine", "ejs");

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

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

//show index page
app.get("/urls", (request, response) => {
  const template = { urls: urlDatabase, email: request.session.email };
  console.log(request.session.email);
  response.render("Index", template);
});

app.post("/urls", (request, response) => {
  console.log(request.body);
  const longURL = request.body.longURL;
  const userID = request.session.userID;
  const urlID = Math.random().toString(36).slice(2, 8);
  const newURL = { urlID, longURL, userID };
  urlDatabase[urlID] = newURL;
  console.log(urlDatabase);
  response.redirect("/urls/:shortURL");
});

//Create new URL
app.get("/urls/new", (request, response) => {
  const template = { urls: urlDatabase, email: request.session.email };
  if (!request.session.email) {
    console.log("Error code 403. Please login to make new tiny URLs");
    response.redirect("/login");
  }
  response.render("New", template);
});

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL].longURL, email: request.session.email };
  response.render("Show", template);
});

app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  response.redirect(longURL);
});

app.post("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = request.body.longURL;
  urlDatabase[shortURL] = longURL;
  response.redirect("/urls");
});

//deleting an URL
app.post("/urls/:shortURL/delete", (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.redirect("/urls");
});

//show register page
app.get("/register", (request, response) => {
  const template = { email: request.session.email };
  response.render("Register", template);
});

//registering
app.post("/register", (request, response) => {
  const { email, password } = request.body;
  const user = findUser(userDatabase, email);
  if (email === "" || password === "" || user) {
    response.status(400).send("Registration failed. Error code 400");
  }
  const userID = Math.random().toString(36).slice(2, 8);
  request.session.email = email;
  request.session.userID = userID;
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  const newUser = { userID, email, password: hashed };
  userDatabase[userID] = newUser;
  console.log(userDatabase);
  response.redirect("/urls");
});

//show login page
app.get("/login", (request, response) => {
  const template = { email: request.session.email };
  response.render("Login", template);
});

//logging in
app.post("/login", (request, response) => {
  const { email, password } = request.body;
  const user = verify(email, password);
  if (!user) {
    response.status(403).send("Error code 403");
  }
  request.session.email = email;
  response.redirect("/urls");
});

//clicking logout
app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});