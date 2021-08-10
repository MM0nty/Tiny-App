const bcrypt = require("bcryptjs");

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

const findUser = function (userDatabase, email) { //same Database but not same Database
  for (const user in userDatabase) {
    console.log("User ", user);
    if (email === userDatabase[user].email) { //user is string
      return userDatabase[user];
    }
  }
  return null;
}

const verify = (email, password) => {
  const user = findUser(userDatabase, email);
  const match = bcrypt.compareSync(password, user.password);
  console.log("Password ", password);
  console.log("User.password ", user.password);
  if (user && match === true) {
    return user
  }
  return null;
}

module.exports = { userDatabase, findUser, verify };