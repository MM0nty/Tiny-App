const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const { userDatabase, urlDatabase, findUser, userURLs } = require("./Helpers");

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { request, response } = require("express");
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
  const longURL = urlDatabase[request.params.shortURL].longURL;
  response.redirect(longURL);
});

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL].longURL, email: request.session.email };
  response.render("Show", template);
});

app.post("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = request.body.longURL;
  urlDatabase[shortURL] = longURL;
  const template = { email: request.session.email };
  response.render("Index", template);
});

app.post("/urls/:shortURL/delete", (request, response) => {
  const template = { email: request.session.email };
  if (request.session.email) {
    //Fix deleting (then editing)
    delete urlDatabase[request.params.shortURL];
  }
  response.render("Index", template);
});

app.get("/register", (request, response) => {
  const template = { email: request.session.email };
  response.render("Register", template);
});

app.post("/register", (request, response) => {
  const { email, password } = request.body;
  const user = findUser(userDatabase, email);
  if (email === "" || password === "" || user) {
    response.redirect(400, "/register");
  }
  const userID = Math.random().toString(36).slice(2, 8);
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  const newUser = { userID, email, password: hashed };
  userDatabase[userID] = newUser;
  console.log("userDatabase:", userDatabase);
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
  if (user && bcrypt.compareSync(password, user.password)) {
    request.session.email = email;
    request.session.userID = user.userID;
    return response.redirect("/urls");
  }
  return response.redirect(403, "/login");
})

app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});