import passport from "passport";
import express from "express";
import {
    logout,
    registerUser
  } from "../authentication/controller.js";

 const router = express.Router();

// Routes for registration, login, and logout
router.post('/register', registerUser);


// Using middleware-passport
router.post('/login', passport.authenticate('local'),
(req, res) => {
  // Check if authentication was successful
  if (!req.user) {
    return res.status(401).json({ error: 'Login failed.' });
  }
  // Login successful
  res.status(200).json({ message: 'Login successful', user: req.user });
  console.error('Login successful');
});

router.get('/current-user', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
  }

  // return current user name
  res.status(200).json({
      user: req.user,
  });
});

router.get("/logout", logout);

export default router;
