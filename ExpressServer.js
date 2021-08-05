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

const users = {
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

{

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});
/**/
}

app.get("/urls", (request, response) => {
  const template = { urls: urlDatabase }; //username: request.cookies["username"],
  response.render("Index", template);
});

// app.post("/urls", (request, response) => {
//   console.log(request.body.longURL);
//   let longURL = request.body.longURL;
//   urlDatabase[longURL];
//   const template = { urls: urlDatabase, username: request.cookies["username"], };
//   const urlContent = request.body.urlContent;
//   const urlID = Math.random().toString(36).slice(2, 8);
//   const newUrl = {
//     id: urlID,
//     shortURL: urlContent
//   }
//   urlDatabase[urlID] = newUrl;
//   response.redirect("/urls");
// });

// //request.body = information from forms
// //request.params = information from  url

// app.get("/urls/new", (request, response) => {
//   const template = { urls: urlDatabase, username: request.cookies["username"], };
//   response.render("New");
// });

app.get("/urls/:shortURL", (request, response) => {
  const template = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL] };//, username: request.cookies["username"] };
  //("/urls/:shortURL" === shortURL: request.params.shortURL
  response.render("Show", template);
});

// app.get("/u/:shortURL", (request, response) => {
//   response.redirect(longURL);
// });

// app.get("/urls/:shortURL/show", (request, response) => {
//   response.redirect("/urls/:shortURL");
//   response.redirect("/urls");
// }); //handler = post or get
// //post => SEND DATA

// app.post("/urls/:shortURL/delete", (request, response) => {
//   delete urlDatabase[request.params.shortURL];
//   response.redirect("/urls");
// });
// //:variable = for express
// //ALWAYS console.log response(body)/response.body and/or request.params

// app.get("/urls/register", (request, response) => {
//   response.cookie("email");
//   const template = { email: request.cookies["email"] };

//   response.render("Register", template);
// });

// app.post("/urls/register", (request, response) => {
//   response.cookie("userID");
//   if (email === "" || password === "" || email === users[email]) { response.send("Error code 400"); };
//   /*
//   */
//   response.redirect("/urls");
// });

// app.get("/urls/login", (request, response) => {

// });

// app.post("/urls/login", (request, response) => {
//   /*
//       <% if (!username) { %>
//     <form method="POST" action="/urls/login"><input type="text" name="username" placeholder="Username">
//       <button type="submit">Submit</button>
//     </form>
//   <% } else { %>
//     Logged in as: <%= username %><form method="POST" action="/urls/logout"><button type="submit">Logout</button></form>
//     <% } %>
//   */
//   if (email !== users[email] || email === users[email] && password !== users[password]) { response.send("Error code 403"); }
//   else if (email === users[email] && password === users[password]) {
//     response.cookie("userID");
//     response.redirect("/urls");
//   };
//   response.cookie("username", request.body.username);
//   console.log(request.body);
//   const template = { username: request.cookies["username"], urls: urlDatabase };
//   response.redirect("/urls");
// });

// app.post("/urls/logout", (request, response) => {
//   response.clearCookie("username");
//   response.redirect("/urls");
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});