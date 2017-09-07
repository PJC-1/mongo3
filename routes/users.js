const express = require('express');
const router = express.Router();

// Bring in User model
let User = require('../models/user');

// Register form
router.get('/register', function(req, res){
    res.render('register');
});


module.exports = router;
