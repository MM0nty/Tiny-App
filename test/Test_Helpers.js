const { assert } = require('chai');

const { findUser, userDatabase } = require('../Helpers.js');

const testUsers = {
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
};

describe('findUser', function() {
  it('should return a user with valid email', function() {
    const user = findUser("user@example.com", userDatabase);
    const output = userDatabase[user];
    assert.equal(user, output);
  });
  it('should return undefined with non-existent email', function() {
    const user = findUser("user@example.com", userDatabase);
    assert.equal(user, undefined);
  });
});