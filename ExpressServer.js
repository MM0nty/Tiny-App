const express = require("express");
const app = express();
const PORT = 8080; //8080 is default port

const database =
{
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com"
};

app.get("/", (request, response) =>
{
  response.send("Hello!");
});

app.listen(PORT, () =>
{
  console.log(`Listening on port ${PORT}!`);
});