const { getUserIdFromEmail, generateRandomString, isPasswordCorrectForEmail, urlsForUser } = require("./helpers");

const express = require("express");
const app = express();

app.set("view engine", "ejs");

const PORT = 8080;
const morgan = require('morgan');

const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ["keyhole"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));



// DATABASES
////////////////////////////////

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "654321"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "123456"
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


// ROUTES
////////////////////////////////

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});


app.get("/", (req, res) => {
  const userId = req.session["userId"];
  if (userId) {
    res.redirect("/urls");
    return;
  }
  res.redirect("/login");
});


app.get("/urls", (req, res) => {
  const userId = req.session["userId"];
  if (!userId) {
    res.send("<h3>Error 403 - Please <a href='/login'>login</a> to access URLs!</h3>");
    return;
  }
  const urls = urlsForUser(userId, urlDatabase);
  const user = users[userId];
  const templateVars = {
    userId: user,
    urls: urls
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const userId = req.session["userId"];
  if (!userId) {
    res.redirect("/login");
    return;
  }
  const user = users[userId];
  const templateVars = {
    userId: user,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {

  const userId = req.session.userId;
  
  if (userId === undefined) {
    res.send("<h3>Error 401 - Please <a href='/login'>login</a> to view and edit your URLs!</h3>");
    return;
  }
  
  const user = users[userId];
  const shortURL = req.params.shortURL;
  const urlBadInput = (urlDatabase[shortURL] === undefined);

  if (urlBadInput) {
    res.send("<h3>Error 404 - URL not found in your library. Please check your <a href='/urls'>table of URLs</a> or <a href='/urls/new'>create a new one</a>!</h3>");
    return;
  }

  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    userId: user,
    urls: urlDatabase,
    longURL: longURL,
    shortURL: shortURL
  };
  res.render("urls_show", templateVars);
});


app.get("/register", (req, res) => {
  const userId = req.session["userId"];
  if (userId) {
    res.redirect("/urls");
    return;
  }
  const user = users[userId];
  const templateVars = {
    userId: user,
    urls: urlDatabase
  };
  res.render("user_register", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.send("<h3>Error 404 - URL not found. Please <a href='/'>try again</a>!</h3>");
    return;
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


app.get("/login", (req,res) => {
  let userId = req.session["userId"];
  if (userId) {
    res.redirect("/urls");
    return;
  }
  const user = users[userId];
  const templateVars = {
    userId: user,
    urls: urlDatabase
  };
  res.render("user_login", templateVars);
});


app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.send("<h3>Error 400 - Must enter valid email and password. <a href='/register'>Try again!</a></h3>");
    return;
  }
  if (getUserIdFromEmail(email, users)) {
    res.send("<h3>Error 400 - Email already in use. <a href='/register'>Try again!</a></h3>");
    return;
  }
  const userId = generateRandomString();
  const hash = bcrypt.hashSync(password, 8);
  users[userId] = {
    id: userId,
    email: email,
    password: hash
  };
  req.session.userId = userId;
  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  
  if (userId === undefined) {
    res.send("<h3>Error 401 - Please <a href='/register'>register</a> or <a href='/login'>login</a> to view!</h3>");
    return;
  }
  const shortURL = generateRandomString();
  const newURLObject = {
    longURL: req.body.longURL,
    userId: userId
  };

  urlDatabase[shortURL] = newURLObject;
  res.redirect(`urls/${shortURL}`);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session["userId"];
  if (userId === undefined) {
    res.send("<h3>Error 401 - Please <a href='/register'>register</a> or <a href='/login'>login</a> to edit!</h3>");
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.send("<h3>Error 400 - Bad Request, empty email and/or password field<a href='/login'>Try again!</a></h3>");
    return;
  }
  if (!getUserIdFromEmail(email, users)) {
    res.send("<h3>Error 403 - Bad credentials. <a href='/login'>Try again!</a></h3>");
    return;
  }
  if (!isPasswordCorrectForEmail(email, password, users)) {
    res.send("<h3>Error 403 - Bad credentials. <a href='/login'>Try again!</a></h3>");
    return;
  }
  const userId = getUserIdFromEmail(email, users);
  req.session.userId = userId;
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});


app.post("/urls/:shortURL", (req, res) => {
  const userId = req.session["userId"];
  if (userId === undefined) {
    res.send("<h3>Error 401 - Please <a href='/register'>register</a> or <a href='/login'>login</a> to edit!</h3>");
    return;
  }
  const shortURL = req.params.shortURL;
  if (req.body.longURL === "") {
    res.redirect(`/urls/${shortURL}`);
    return;
  }
  const newURLObject = {
    longURL: req.body.longURL,
    userId: userId
  };
  urlDatabase[shortURL] = newURLObject;
  res.redirect("/urls");
});


app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});
