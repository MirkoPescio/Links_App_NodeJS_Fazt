const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const path = require("path");
const flash = require("connect-flash");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");
const router = require("./routes/index.js");
const authentication = require("./routes/authentication.js");
const links = require("./routes/links.js");
const { database } = require("./keys.js");


// Initialization
const app = express();
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./lib/passport.js');

// setings
app.set('port', process.env.PORT || 8080);
app.set("views", path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'mirkomysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});

// Routes
app.use(router);
app.use(authentication);
app.use('/links', links);

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the Server
app.listen(app.get('port'), () => {
    console.log("Servidor escuchado en el puerto:", app.get('port'));
});