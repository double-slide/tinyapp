const express = require("express");
const app = express();
app.set("view engine", "ejs");

const PORT = 8080; // default port 8080
const morgan = require('morgan');

const bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  shortURL = generateRandomString()
  longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let cookieForUser = req.body.username;
  res.cookie('username', cookieForUser);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  // let cookieForUser = req.body.username;
  res.clearCookie('username');
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  shortURL = req.params.shortURL;
  console.log("shortURL:",shortURL)
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

const generateRandomString = function() {
  let characters = '0123456789abcdeghijklmnopqrstuvwxyz';
  let randomUrl = "";
  for (let i = 0; i < 6; i++) {
    let randomChar = Math.floor(Math.random() * 35)
    randomUrl += characters[randomChar];
  }
  return randomUrl;
};

