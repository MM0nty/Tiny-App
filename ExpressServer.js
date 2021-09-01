const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { request, response } = require("express");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
const { Template } = require("ejs");
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const template = { urls: urlDatabase, username: request.cookies["username"] };
  response.render("Index", template);
});

app.post("/urls", (request, response) => {
  const longURL = request.body.longURL;
  const urlID = Math.random().toString(36).slice(2, 8);
  urlDatabase[urlID] = longURL;
  response.redirect("/urls/" + urlID);
});

app.get("/urls/new", (request, response) => {
  const template = { username: request.cookies["username"]}
  response.render("New", template);
});

app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];
  response.redirect(longURL);
});

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL]/* What goes here? */, username: request.cookies["username"] };
  response.render("Show", template);
});

app.post("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = request.body.longURL;
  urlDatabase[shortURL] = longURL;
  const template = { username: request.cookies["username"]}
  response.render("Index", template);
});

app.post("/urls/:shortURL/delete", (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.render("Index", template);
});

app.post("/login", (request, response) => {
  const username = request.body.username;
  response.cookie("username", username);
  response.redirect("/urls");
})

app.post("/logout", (request, response) => {
  response.clearCookie("username");
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});