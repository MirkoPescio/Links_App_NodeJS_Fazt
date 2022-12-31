const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs');
});

router.post('/signup', (req, res) => {
    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    });
    console.log(req.body);
});

router.get('/profile', (req, res) => {
    res.send('Este es tu perfil');
});

module.exports = router;