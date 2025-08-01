const { validateUser, validUsername, validPassword } = require('../models/user');

function showLogin(req, res) {
  if (req.session.isLoggedIn) {
    return res.redirect('/home');
  }
  res.render('login', { error: null });
}

function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}

function login(req, res) {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();

  if (!validateUser(username, password)) {
    let error = 'Both username and password are incorrect.';
    if (username === validUsername && password !== validPassword) {
      error = 'Username is correct, but password is incorrect.';
    } else if (username !== validUsername && password === validPassword) {
      error = 'Password is correct, but username is incorrect.';
    }
    return res.render('login', { error });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.render('login', { error: 'Session error. Please try again.' });
    }
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.redirect('/home');
  });
}

function showHome(req, res) {
  res.render('home', { username: req.session.username });
}

function logout(req, res) {
  req.session.destroy((err) => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
}

module.exports = { showLogin, isAuthenticated, login, showHome, logout };
