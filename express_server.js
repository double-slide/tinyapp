const express = require("express");
const app = express();
app.set("view engine", "ejs");

const PORT = 8080; // default port 8080
const morgan = require('morgan');

const bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());




// PSEUDO DATABASES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  '123456': {
    id: "123456", 
    email: "user123456@example.com", 
    password: "123456-purple-monkey-dinosaur"
  },
  '654321': {
    id: "654321", 
    email: "b@b.com", 
    password: "b"
  }
};




// HELPER FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


// GET FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
  
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  const templateVars = { 
    user_id: user,
    urls: urlDatabase
  };
  
  res.render("urls_index", templateVars);
  // res.render("urls_index");
});

app.get("/urls/new", (req, res) => {
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  const templateVars = { 
    user_id: user,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  // console.log("req.params.shortURL", req.params.shortURL);
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
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
  longURL = urlDatabase[shortURL];
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




// POST FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
  // console.log("users:", users);
  res.cookie('user_id', user_id);
  res.redirect("/urls");
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

  // plant cookie
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
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});  

app.post("/urls/:shortURL/edit", (req, res) => {
  shortURL = req.params.shortURL;
  console.log("shortURL:",shortURL)
  res.redirect(`/urls/${shortURL}`);
});