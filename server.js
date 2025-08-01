
const express = require("express");
const session = require('express-session');
const path = require('path');
const authroutes = require('./router/authroutes');
const app = express();
const PORT = 3002;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (!req.url.startsWith('/login')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

app.use(session({
  secret: 'your-strong-secret-here',
  resave: false,
  saveUninitialized: false,
  
}));


app.use('/', authroutes);

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});


