const express = require("express");
const app = express();
const PORT = 8080; //8080 is default port
const bodyParser = require("body-parser");

function randomString()
{

}

app.use(bodyParser.urlencoded({extended: true}));

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

app.get("/hello", (request, response) =>
{
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, response) =>
{
  const template = { urls: database };
  response.render("Index", template);
});

app.post("/urls", (request,response) =>
{
  console.log(request.body);
  response.send("Ok");
});

app.get("/urls/new", (request, response) =>
{
  const template = { urls: database };
  response.render("New", template);
});

app.get("/urls/:shortURL", (request, response) =>
{
  const template = { shortURL: request.params.shortURL};
  response.render("Show", template);
});

app.get("/urls/:shortURL", (request, response) =>
{
  response.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (request, response) =>
{
  delete database.request.params.shortURL;
  console.log(response(body));
  console.log(request.params,shortURL);
  response.redirect("/urls");
});
//ALWAYS console.log response(body)/response.body and/or request.params

app.post("/urls/:shortURL/edit", (request, response) =>
{
  //edit database[request.params.shortURL];
  response.redirect("/urls");
})

app.listen(PORT, () =>
{
  console.log(`Listening on port ${PORT}!`);
});