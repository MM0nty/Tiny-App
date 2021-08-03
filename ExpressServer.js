const express = require("express");
const app = express();
const PORT = 8080; //8080 is default port

app.set("view engine", "ejs");

const database =
{
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com"
};

app.get("/", (request, response) =>
{
  response.send("Hello!");
});

app.get("/urls.json", (request, response) =>
{
  const template = { urls: database };
  response.render("Index", template);
});

app.get("/hello", (request, response) =>
{
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:shortURL", (request, response) =>
{
  const template = { shortURL: request.params.shortURL, longURL: request.params.longURL };
  response.render("Show", template);
});

app.listen(PORT, () =>
{
  console.log(`Listening on port ${PORT}!`);
});