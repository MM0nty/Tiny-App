const { assert } = require('chai');

const { findUser, userDatabase } = require('../Helpers.js');

const testUsers = {
  "userRandomID": {
    userID: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    userID: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  }
};

describe('findUser', function() {
  it('should return a user with valid email', function() {
    const user = findUser(userDatabase, "user@example.com");
    const output = testUsers["userRandomID"];
    // Write your assert statement here
    assert.deepEqual(user, output);
  });

  describe('findUser', function() {
    it('should return undefined if email is non-existent', function() {
      const user = findUser(userDatabase, "undefined@email.com");
      const output = undefined;
      assert.equal(user, output);
    });
  });
});