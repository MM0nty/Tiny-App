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
};

//find if email already used
const findUser = function(userDatabase, email) {
  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return null;
};

//verify login
const verify = (email, password) => {
  const user = findUser(userDatabase, email);
  const match = bcrypt.compareSync(password, user.password);
  console.log("Password ", password);
  console.log("User.password ", user.password);
  if (user && match === true) {
    return user;
  }
  return undefined;
};

module.exports = { userDatabase, findUser, verify };