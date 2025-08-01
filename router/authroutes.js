const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

// Login page
router.get('/', authController.showLogin);

// Login form submission
router.post('/login', authController.login);

// Home page (protected)
router.get('/home', authController.isAuthenticated, authController.showHome);

// Logout
router.get('/logout', authController.logout);

module.exports = router;