const bcrypt = require("bcryptjs");

const getUserIdFromEmail = function(email, database) {
  for (let property in database) {
    if (database[property].email === email) {
      return database[property].id;
    }
  }
  return undefined;
};

const generateRandomString = function() {
  let characters = '0123456789abcdeghijklmnopqrstuvwxyz';
  let randomUrl = "";
  for (let i = 0; i < 6; i++) {
    let randomChar = Math.floor(Math.random() * 35);
    randomUrl += characters[randomChar];
  }
  return randomUrl;
};

const isPasswordCorrectForEmail = function(email, password, database) {
  for (let property in database) {
    const storedEmail = database[property].email;
    const storedPassword = database[property].password;
    const hashCheck = bcrypt.compareSync(password, storedPassword);
    if (storedEmail === email && hashCheck) {
      return true;
    }
  }
  return false;
};

const urlsForUser = function(idToFilter, database) {
  const filteredUrlObject = {};
  const keys = Object.keys(database);
  for (const shortURL of keys) {
    const url = database[shortURL];
    if (url.userId === idToFilter) {
      filteredUrlObject[shortURL] = url;
    }
  }
  return filteredUrlObject;
};

module.exports = {
  getUserIdFromEmail,
  generateRandomString,
  isPasswordCorrectForEmail,
  urlsForUser
};