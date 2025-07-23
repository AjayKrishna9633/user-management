
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
app.use(express.static('public'));app.use(express.static('public'));
// Set Cache-Control: no-store for all dynamic routes (not static assets)



app.use((req, res, next) => {
  if (!req.url.startsWith('/login')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});



app.use(session({
  secret: 'your-strong-secret-here', // Use a strong, unpredictable secret in production
  resave: false,
  saveUninitialized: false, // Only save sessions when something is stored
  cookie: {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    // secure: true, // Uncomment if using HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// Authentication middleware

function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}



function handleSessionDestroy(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.log('Session destroy error:', err);
    }
    next();
  });
}

function checkCredentials(req, res, next) {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();
 

  if (username !== validUsername && password === validPassword) {
    return res.render('login', { error: 'Password is correct, but username is incorrect.' });
  } else if (username === validUsername && password !== validPassword) {
    return res.render('login', { error: 'Username is correct, but password is incorrect.' });
  } else if (username !== validUsername && password !== validPassword) {
    return res.render('login', { error: 'Both username and password are incorrect.' });
  }

  // If credentials are correct, set session and proceed
  req.session.isLoggedIn = true;
  req.session.username = username;
  next();
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
app.post('/login',checkCredentials, (req, res) => {
  // Regenerate session after successful login to prevent session fixation
  req.session.regenerate((err) => {
    if (err) {
      console.log('Session regenerate error:', err);
      return res.render('login', { error: 'Session error. Please try again.' });
    }
    req.session.isLoggedIn = true;
    req.session.username = req.body.username;
console.log(req.body)

    res.redirect('/home');
  });
});

// Home page (protected)
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { username: req.session.username });
});


// Logout
app.get('/logout', handleSessionDestroy, (req, res) => {
  res.clearCookie('connect.sid'); // Clear session cookie after destroy
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});


