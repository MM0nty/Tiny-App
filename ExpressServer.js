const express = require("express");
const app = express();
const PORT = 8080; //8080 is default port
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase =
{
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com"
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
}

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
  const template = { urls: urlDatabase, email: request.cookies["email"] }
  response.render("Index", template);
});

app.post("/urls", (request, response) => {
  console.log(request.body);
  const longURL = request.body.longURL;
  // console.log(request.body.urlContent);
  const urlID = Math.random().toString(36).slice(2, 8);
  //response.send("200 Status code");
  // const newUrl = {
  //   urlID: urlID,
  //   shortURL: longURL
  // }
  urlDatabase[urlID] = longURL;
  console.log(urlDatabase);
  response.redirect("/urls/:shortURL");
  //response.send("Ok");
});
// //request.body = information from forms
// //request.params = information from  url

app.get("/urls/new", (request, response) => {
  const template = { urls: urlDatabase, email: request.cookies["email"], };
  response.render("New", template);
});

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL], email: request.cookies["email"] };
  //("/urls/:shortURL" === shortURL: request.params.shortURL
  response.render("Show", template);
});

app.get("/u/:shortURL", (request, response) => { //get: show page
  response.redirect(longURL);
});

// }); //handler = post or get
// //post => SEND DATA

app.post("/urls/:shortURL", (request, response) => {
  shortURL = request.params.shortURL; //accessing the variable
  const longURL = request.body.longURL;
  urlDatabase[shortURL] = longURL;
  response.redirect("/urls");
}) //:variable = making variable

app.post("/urls/:shortURL/delete", (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.redirect("/urls");
});
// //ALWAYS console.log response(body)/response.body and/or request.params

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
  const newUser = { userID, email, password };
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


const findUser = function (userDatabase, email) {
  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
}

const verify = (email, password) => {
  const user = findUser(userDatabase, email);
  if (user && user.password === password) {
    return user
  }
  return null;
}

app.post("/logout", (request, response) => {
  response.clearCookie("email");
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});