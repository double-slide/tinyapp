const express = require("express");
const app = express();
app.set("view engine", "ejs");

const PORT = 8080; // default port 8080
const morgan = require('morgan');

const bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
const res = require("express/lib/response");


app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());



// PSEUDO DATABASES
////////////////////////////////

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    user_id: "654321"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    user_id: "123456"
  }
};

const users = {
  '123456': {
    id: "123456", 
    email: "a@a.com", 
    password: "a"
  },
  '654321': {
    id: "654321", 
    email: "b@b.com", 
    password: "b"
  }
};



// HELPER FUNCTIONS
////////////////////////////////

const generateRandomString = function() {
  let characters = '0123456789abcdeghijklmnopqrstuvwxyz';
  let randomUrl = "";
  for (let i = 0; i < 6; i++) {
    let randomChar = Math.floor(Math.random() * 35)
    randomUrl += characters[randomChar];
  }
  return randomUrl;
};

const emailRegisteredAlready = function(candidateEmail) { 
  for (let property in users) {
    if (users[property].email === candidateEmail) {
      return true;
    }
  }
  return false;
};

const getUserIdFromEmail = function(verifiedEmail) {
  for (let property in users) {
    if (users[property].email === verifiedEmail) {
      return users[property].id;
    }
  }
  console.log("Email was not found in users object");
  return;
}

const isPasswordCorrectForEmail = function(verifiedEmail, candidatePassword) {
  for (let property in users) {
    if (users[property].email === verifiedEmail && users[property].password == candidatePassword) {
      return true;
    }
  }

  console.log("Wrong password submitted");
  return false;
};

const urlsForUser = function(idToFilter) {
  console.log("urlDatabase:",urlDatabase);
  const filteredUrlObject = {};
  const keys = Object.keys(urlDatabase);
  for (const shortURL of keys) {
    const url = urlDatabase[shortURL];
    if (url.user_id === idToFilter) {
      filteredUrlObject[shortURL] = url;
    }
  }
  console.log("filteredUrlObject:",filteredUrlObject);

  return filteredUrlObject;
}



// ROUTES
////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/", (req, res) => {
  res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  let user_id = req.cookies["user_id"]
  if (!user_id) {
    res.send("Please <a href='/login'>login</a> to view URLs!")
    return;
  }
  const urls = urlsForUser(user_id);
  let user = users[user_id];
  const templateVars = { 
    user_id: user,
    urls: urls
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  let user_id = req.cookies["user_id"]
  if (!user_id) {
    res.send("Please <a href='/login'>login</a> to create a new URL!")
    return;
  }
  let user = users[user_id];
  const templateVars = { 
  user_id: user,
  urls: urlDatabase
  }
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.cookies["user_id"]
  if (user_id === undefined){
    res.send("Please <a href='/login'>login</a> to view and edit your URLs!");
    return
  }
  let user = users[user_id];
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;

  const templateVars = { 
    user_id: user,
    urls: urlDatabase,
    longURL: longURL,
    shortURL: shortURL
  };
  res.render("urls_show", templateVars);
});  


app.get("/register", (req, res) => {
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  const templateVars = { 
    user_id: user,
    urls: urlDatabase
  };
  res.render("user_register", templateVars);
});  


app.get("/u/:shortURL", (req, res) => {
  shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.send("Sorry, short URL does not exist. Please try again!");
  }
  longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


app.get("/login", (req,res) => {
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  const templateVars = { 
    user_id: user,
    urls: urlDatabase
  };
  res.render("user_login", templateVars);
});


app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === "") {
    res.send("Error 400 - Bad Request, empty email or password field");
    console.log("users", users);
    return;
  }
  if (emailRegisteredAlready(email)) {
    res.send("Error 400 - Bad Request, email already registered");
    console.log("users", users);
    return;
  }
  user_id = generateRandomString();
  users[user_id] = {
    id: user_id,
    email: email,
    password: password
  }  
  res.cookie('user_id', user_id);
  res.redirect("/urls");
});  


app.post("/urls", (req, res) => {
  let user_id = req.cookies["user_id"]
  
  if (user_id === undefined){
    res.send("Please <a href='/login'>login</a> to view!");
    return;
  }
  shortURL = generateRandomString()
  let newURLObject = {
    longURL: req.body.longURL,
    user_id: user_id
  }

  urlDatabase[shortURL] = newURLObject;
  res.redirect(`urls/${shortURL}`);
});  


app.post("/urls/:shortURL/delete", (req, res) => {
  let user_id = req.cookies["user_id"]
  if (user_id === undefined){
    res.send("Please <a href='/login'>login</a> to edit!");
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});  


app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === "") {
    res.send("Error 400 - Bad Request, empty email or password field");
    return;
  }
  if (!emailRegisteredAlready(email)) {
    res.send("Error 403 - Forbidden, email not registered");
    return;
  }
  if (!isPasswordCorrectForEmail(email, password)) {
    res.send("Error 403 - Forbidden, no credential match found");
    return;
  }
  user_id = getUserIdFromEmail(email);
  console.log("user_id", user_id);
  console.log("typeof user_id", typeof user_id);
  res.cookie('user_id', user_id);
  res.redirect("/urls");
});  


app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});  


app.post("/urls/:shortURL/update", (req, res) => {
  let user_id = req.cookies["user_id"]
  if (user_id === undefined){
    res.send("Please <a href='/login'>login</a> to edit!");
    return;
  }
  const shortURL = req.params.shortURL;
  let newURLObject = {
    longURL: req.body.longURL,
    user_id: user_id
  }
  urlDatabase[shortURL] = newURLObject;
  res.redirect("/urls");
});  


app.post("/urls/:shortURL/edit", (req, res) => {
  shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});