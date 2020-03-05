var bodyParser = require("body-parser"),
    express = require("express"),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    session = require('express-session'),
    flash = require('connect-flash');

// Routes
var indexRouter = require('./routes/index'),
    verifyRouter = require('./routes/verify'),
    authRouter = require('./routes/auth'),
    userRouter = require('./routes/user');

const app = express(),
    PORT = 5000;

//App Setup
app.set('views', path.join(__dirname + '/views'));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes Setup
app.use('/', indexRouter);
app.use('/verify', verifyRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// Express Session Middleware
app.use(session({
    secret: 'I have a mango tree',
    saveUninitialized: true,
    resave: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect-Flash Middleware
app.use(flash());

// app.get('*', function (req, res) {
//     console.log('404 not found');
//     res.send('404 not found');
// });

//Defining Local Variables
app.use(function (req, res, next) {
    next();
});

app.listen(PORT, function () {
    console.log("Server up on port " + PORT);
});
