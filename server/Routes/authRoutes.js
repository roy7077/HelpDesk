const express=require('express');
const router=express.Router();
const { signUp, login } = require('../Controllers/Auth');

router.post('/signup', signUp);   // Register a new user
router.post('/login', login);     // Log in an existing user

// router.post('/logout', logout);               // Log out a user
// router.post('/refresh-token', refreshToken);  // Refresh user token if using JWT

module.exports=router;