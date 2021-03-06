var bodyParser = require("body-parser"),
    express = require("express"),
    path = require('path'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('connect-flash'),
    mysql = require('mysql');

const initializePassport = require('./passport-config');
const initDb = require('./config/db_config');

// Database Connection
var con = initDb(mysql);

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected to the database on app.js');
});

// Routes
var indexRouter = require('./routes/index'),
    verifyRouter = require('./routes/verify'),
    authRouter = require('./routes/auth'),
    userRouter = require('./routes/user'),
    serviceRouter = require('./routes/service');

var workerRouter = require('./routes/worker');

var testRouter = require('./routes/test');

const app = express(),
    PORT = process.env.PORT || 5000;

//App Setup
app.set('views', path.join(__dirname + '/views'));
app.set("view engine", "ejs");
app.set('con', con); // Setting MySQL Connection Object as GLOBAL Variable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Connect-Flash Middleware
app.use(flash());

// Express Session Middleware
app.use(session({
    secret: 'I have a mango tree',
    saveUninitialized: true,
    resave: true
}));

// Passport Middleware
initializePassport(passport, app, con);

//Defining Local Variables
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes Setup
app.use('/', indexRouter);
app.use('/verify', verifyRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/service', serviceRouter);
app.use('/worker', workerRouter);
app.use('/test', testRouter);

// app.get('*', function (req, res) {
//     console.log('404 page not found');
//     res.render('notFound');
// });

app.listen(PORT, function () {
    console.log("Server up on port " + PORT);
});
