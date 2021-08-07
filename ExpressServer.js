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

  //   console.log(request.body.longURL);
  // let longURL = request.body.longURL;
  // urlDatabase[longURL];
  const template = { urls: urlDatabase, email: request.cookies["email"], };
  const longURL = request.body.longURL;
  // console.log(request.body.urlContent);
  const urlID = Math.random().toString(36).slice(2, 8);
  //response.send("200 Status code");
  const newUrl = {
    id: urlID,
    shortURL: longURL
  }
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
// //:variable = for express
// //ALWAYS console.log response(body)/response.body and/or request.params

app.get("/register", (request, response) => {
  const template = { email: request.cookies["email"], email: request.cookies["email"] };

  response.render("Register", template);
});

app.post("/register", (request, response) => {
    
  const { email, password } = request.body;
    if (email === "" || password === "" || email === userDatabase[email]) { response.status(400).send("Error code 400"); };
  const id = Math.random().toString(36).slice(2, 8);
  response.cookie("email", email);
  response.cookie("id", id);
  const newUser = { id, email, password };
  userDatabase[id] = newUser;
  console.log(request.params.userDatabase);
  response.redirect("/urls");
});

app.get("/login", (request, response) => {
 const template = { email: request.cookies["email"], email: request.cookies["email"] };
});

// const authenticateUser = (email, password) => {
//   if (user) {
//     if (user.password === password) {
//       return user
//     }
//     return null;
//   }
//   return null;
// }


// app.get("/", (request, response) => {
//   const user = usersDatabase[request.cookies.id];
//   const template = { name: user ? user.name : "" };
//   response.render("Index", template);
// })


app.post("/login", (request, response) => {
//   const { email, password } = request.body;
//   const user = authenticateUser(email, password);
// if (user) {
//   response.cookie(userID, userID)
// }
  /*
      <% if (!email) { %>
    <form method="POST" action="/urls/login"><input type="text" name="email" placeholder="email">
      <button type="submit">Submit</button>
    </form>
  <% } else { %>
    Logged in as: <%= email %><form method="POST" action="/urls/logout"><button type="submit">Logout</button></form>
    <% } %>
  */
  //   if (email !== users[email] || email === users[email] && password !== users[password]) { response.send("Error code 403"); }
  //   else if (email === users[email] && password === users[password]) {
  //     response.cookie("userID");
  //     response.redirect("/urls");
  //   };
  response.cookie("email", request.body.email);
  //   console.log(request.body);
  const template = { email: request.cookies["email"], urls: urlDatabase };
  response.redirect("/urls");
});

app.post("/logout", (request, response) => {
  response.clearCookie("email");
  response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});