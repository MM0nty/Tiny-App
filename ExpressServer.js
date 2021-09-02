const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const { userDatabase, urlDatabase, findUser, userURLs } = require("./Helpers");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["key0"]
}));

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
  const userID = request.session.userID;
  const template = {urls: userURLs(userID), email: request.session.email };
  response.render("Index", template);
});

//Takes in longURL, creates userID cookie, and generates random string for shortURL to make newURL object and adding it to urlDatabase
app.post("/urls", (request, response) => {
  const longURL = request.body.longURL;
  const userID = request.session.userID;
  const shortURL = Math.random().toString(36).slice(2, 8);
  const newURL = { longURL, userID };
  urlDatabase[shortURL] = newURL;
  response.redirect("/urls/" + shortURL);
});

app.get("/urls/new", (request, response) => {
  const template = { email: request.session.email };
  if (!request.session.email) {
    response.redirect("/login");
  }
  response.render("New", template);
});

app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  response.redirect(longURL);
});

app.get("/urls/:shortURL", (request, response) => {
  const userID = request.session.userID;
  const template = { shortURL: request.params.shortURL, longURL: userURLs(userID)[request.params.shortURL].longURL, email: request.session.email };
  console.log("urlDatabase:", urlDatabase);
  response.render("Show", template);
});

app.post("/urls/:shortURL", (request, response) => {
  const userID = request.session.userID;
  const shortURL = request.params.shortURL;
  const longURL = request.body.longURL;
  console.log("urlDatabase:", urlDatabase);
  urlDatabase[shortURL].longURL = longURL;
  console.log("urlDatabase:", urlDatabase);
  const template = { urls: userURLs(userID), email: request.session.email };
  response.render("Index", template);
});

app.post("/urls/:shortURL/delete", (request, response) => {
  const userID = request.session.userID;
  const template = { urls: userURLs(userID), email: request.session.email };
  if (request.session.email && userID === urlDatabase[request.params.shortURL].userID) {
    delete urlDatabase[request.params.shortURL];
  }
  response.redirect("/urls");
});

app.get("/register", (request, response) => {
  const template = { email: request.session.email };
  response.render("Register", template);
});

//Registers user in userDatabase if email is not already used
app.post("/register", (request, response) => {
  const { email, password } = request.body;
  const user = findUser(userDatabase, email);
  if (email === "" || password === "" || user) {
    response.redirect(400, "/register");
  }
  const userID = Math.random().toString(36).slice(2, 8);
  //Hashes password and encrypts cookies for security
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  const newUser = { userID, email, password: hashed };
  userDatabase[userID] = newUser;
  request.session.email = email;
  request.session.userID = userID;
  response.redirect("/urls");
});

app.get("/login", (request, response) => {
  const template = { email: request.session.email };
  response.render("Login", template);
});

app.post("/login", (request, response) => {
  const { email, password } = request.body;
  const user = findUser(userDatabase, email);
  //If email and password are correct, redirects to /urls
  if (user && bcrypt.compareSync(password, user.password)) {
    request.session.email = email;
    request.session.userID = user.userID;
    return response.redirect("/urls");
  }
  return response.redirect(403, "/login");
})

//Deletes all cookies
app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});