const express = require("express");
const app = express();
const PORT = 8080; //8080 is default port
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

function randomString()
{

}

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const database =
{
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com"
};

const users =
{ 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

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
  const template = { urls: database, username: request.cookies["username"], };
  response.render("Index", template);
});

app.post("/urls", (request,response) =>
{
  console.log(request.body);
  response.send("Ok");
}); //request.body = information from forms
//request.params = information from  url

app.get("/urls/new", (request, response) =>
{
  const template = { urls: database, username: request.cookies["username"], };
  response.render("New", template);
});

app.get("/urls/:shortURL", (request, response) =>
{
  const template = { shortURL: request.params.shortURL, longURL: database[request.params.shortURL] };
  //("/urls/:shortURL" === shortURL: request.params.shortURL
  response.render("Show", template);
});

app.get("/u/:shortURL", (request, response) =>
{
  response.redirect(longURL);
});

app.get("/urls/:shortURL/show", (request, response) =>
{
  response.redirect("/urls/:shortURL");
  response.redirect("/urls");
}); //handler = post or get
//post => SEND DATA

app.post("/urls/:shortURL/delete", (request, response) =>
{
  delete database[request.params.shortURL];
  response.redirect("/urls");
});
//:variable = for express
//ALWAYS console.log response(body)/response.body and/or request.params

app.post("/urls/register", (request, response) =>
{
  response.cookie("userID");
/*
<form method="POST" <action="/urls/register>
<input type="email" name="email">
<input type="password" name="password">
<button type="submit">Register</button>
*/
  response.redirect("/urls");
});

app.get("/urls/register", (request, response) =>
{
  response.cookie("email");
  const template = {email: request.cookies["email"]};
  
  response.render("Register", template);
});

app.post("/urls/login", (request, response) =>
{
  response.cookie("username", request.body.username);
  console.log(request.body);
  const template = {username: request.cookies["username"], urls: database};
  response.redirect("/urls");
});

app.post("/urls/logout", (request, response) =>
{
  response.clearCookie("username");
  response.redirect("/urls");
});

app.listen(PORT, () =>
{
  console.log(`Listening on port ${PORT}!`);
});