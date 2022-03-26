const { assert } = require('chai');

const { getUserIdFromEmail } = require('../helpers.js');

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

describe('getUserIdFromEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserIdFromEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    
    assert.isTrue(user === expectedUserID);
  });
  it('should return null if user is not yet registered', function() {
    const user = getUserIdFromEmail("doesnotexist@example.com", testUsers);
    assert.isUndefined(user);
  });
});