const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const helpers = require("./helpers.js");
const pool = require("../database.js");

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const { fullname } = req.body;
    let newUser = {
        fullname,
        username,
        password
    };
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});