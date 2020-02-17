var bodyParser = require("body-parser"),
    express = require("express"),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    session = require('express-session'),
    flash = require('connect-flash');

// Routes
var indexRouter = require('./routes/index'),
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
passport.serializeUser(function (user, done) {
    done(null, user[0].username);
});
passport.deserializeUser(function (email_id, done) {
    con.query("select * from users where email_id = ?", [email_id], function (err, user) {
        done(err, user);
    });
});
passport.use('local',
    new LocalStrategy({ passReqToCallback: true },
        function (email_id, password, done) {
            var sql = 'SELECT * FROM users WHERE email_id = ?';

            con.query(sql, [email_id], function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username' });
                }
                if (user[0].password != password) {
                    console.log("error!!");
                    return done(null, false, { message: 'Incorrect password' });

                }
                user_id = user[0].id;
                return done(null, user);
            });
        }
    ));

// Connect-Flash Middleware
app.use(flash());

app.get('*', function (req, res) {
    console.log('404 not found');
    res.send('404 not found');
});

//Defining Local Variables
app.use(function (req, res, next) {
    req.locals.currentUser = req.user || null;
    next();
});

app.listen(PORT, function () {
    console.log("Server up on port " + PORT);
});
