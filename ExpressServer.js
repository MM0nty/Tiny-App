const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({extended: true}));


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
  const template = { urls: urlDatabase };
  response.render("Index", template);
});

app.post("/urls", (request, response) => {
  console.log(request.body);  // Log the POST request body to the console
  response.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (request, response) => {
  response.render("New");
});

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL]/* What goes here? */ };
  response.render("Show", template);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});