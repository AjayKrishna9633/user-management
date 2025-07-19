const { error } = require("console");
const express = require("express");
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3002;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //to set the views directory


const validUsername = "ajay";
const validPassword = "password@123";


// Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data
 app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set Cache-Control: no-store for all dynamic routes (not static assets)



app.use((req, res, next) => {
  if (!req.url.startsWith('/login')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});



app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Authentication middleware

function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}

// Routes

// Login page


app.get('/', (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/home');
  } else {
    res.render('login', { error: null });
  }
});
 
// Login form handler
app.post('/login', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim(); 


  
  
  if (!username && !password) {
    return res.render('login', { error: 'You haven\'t entered the username and password.' });
  } else if (!username) {
    return res.render('login', { error: 'You haven\'t entered the username.' });
  } else if (!password) {
    return res.render('login', { error: 'You haven\'t entered the password.' });
  }
  else if (username !== validUsername && password === validPassword) {
    res.render('login', { error: 'Password is correct, but username is incorrect.' });
  } else if (username === validUsername && password !== validPassword) {
    res.render('login', { error: 'Username is correct, but password is incorrect.' });
  } else if (username !== validUsername && password !== validPassword) {
    res.render('login', { error: 'Both username and password are incorrect.' });
  }
   
   else {
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.redirect('/home');
  }
});

// Home page (protected)
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { username: req.session.username });
});


// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Session destroy error:', err);
    }
    res.set('Cache-control','no-store');
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});

console.log('hello world ')
