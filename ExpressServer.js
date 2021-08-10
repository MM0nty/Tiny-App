const express = require("express");
const app = express();
const PORT = 8080; //8080 is default port
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const { userDatabase, findUser, verify } = require("./Helpers");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["key0"]
}));

app.set("view engine", "ejs");

const urlDatabase =
{
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
  console.log(hashedPassword);
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, response) => {

  const template = { urls: urlDatabase, email: request.cookies["email"] }
  response.render("Index", template);
});

app.post("/urls", (request, response) => {
  console.log(request.body);
  const longURL = request.body.longURL;
  const userID = request.cookies["userID"];
  // console.log(request.body.urlContent);
  const urlID = Math.random().toString(36).slice(2, 8);
  //response.send("200 Status code");
  const newURL = { urlID, longURL, userID };
  urlDatabase[urlID] = newURL;
  console.log(urlDatabase);
  response.redirect("/urls/:shortURL");
  //response.send("Ok");
});
//request.body = information from forms
//request.params = information from  url

app.get("/urls/new", (request, response) => {

  const template = { urls: urlDatabase, email: request.cookies["email"], };
  if (!request.cookies["email"]) {
    console.log("Error code 403. Please login to make new tiny URLs");
    response.redirect("/login");
  }
  response.render("New", template);
});

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL].longURL, email: request.cookies["email"] };
  console.log(urlDatabase[request.params.shortURL].longURL);
  //("/urls/:shortURL" === shortURL: request.params.shortURL
  response.render("Show", template);
});

app.get("/u/:shortURL", (request, response) => { //get: show page
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL; //longURL is object
  response.redirect(longURL); //longURL not defined
});
//handler = post or get
//post => SEND DATA

app.post("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL; //accessing the variable
  const longURL = request.body.longURL;
  urlDatabase[shortURL] = longURL;
  response.redirect("/urls");
}) //:variable = making variable

app.post("/urls/:shortURL/delete", (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.redirect("/urls");
});
//ALWAYS console.log response(body)/response.body and/or request.params

app.get("/register", (request, response) => {
  const template = { email: request.cookies["email"] };
  response.render("Register", template);
});

app.post("/register", (request, response) => {
  const { email, password } = request.body;
  const user = findUser(userDatabase, email);
  // console.log(userDatabase[email]);
  if (email === "" || password === "" || user) {
    response.status(400).send("Registration failed. Error code 400");
  };
  const userID = Math.random().toString(36).slice(2, 8);
  response.cookie("email", email);
  response.cookie("userID", userID);
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  const newUser = { userID, email, password: hashed };
  userDatabase[userID] = newUser;
  console.log(userDatabase);
  response.redirect("/urls");
});

app.get("/login", (request, response) => {
  const template = { email: request.cookies["email"] };
  response.render("Login", template);
});


app.post("/login", (request, response) => {
  // request.body { email: "email", password: "password" }
  const { email, password } = request.body;
  
  const user = verify(email, password);
  if (!user) {
    response.status(403).send("Error code 403");
  }
  response.cookie("userID", request.body.userID);
  response.cookie("email", request.body.email);
  //   console.log(request.body);
  response.redirect("/urls");
});

app.post("/logout", (request, response) => {
  response.clearCookie("email");
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});