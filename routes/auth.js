var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mangotree@123',
    database: 'workforce'
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected to the database');
});

// ------------ Routes Started ----------------//

router.get('/', function (req, res) {
    console.log('Inside auth router');
    res.send('auth');
});

router.get('/test', function (req, res) {
    console.log('GET request for /auth/test');
    q = 'SELECT * FROM users';
    con.query(q, function (err, records, fields) {
        if (err) throw err;
        console.log(records);
        res.render('test', { records: records });
    });
});

// Auth Routes
// login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/',
    failureRedirect: '/',
}), function (req, res) {
    console.log('Logged In user:', req.user);
});

router.get('/login', function (req, res) {
    res.render('login');
});

// register 
router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    repassword = req.body.repassword;
    password = req.body.password;

    var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        email_id: req.body.email_id,
        phone_number: req.body.phone_number,
        profile_photo: req.body.profile_photo,
        password: req.body.password
    }

    if (repassword != newUser.password) {
        console.log(password, repassword);
        // req.flash('error', 'Password and re-entered password must be same');
        console.log('password error');
        res.redirect('/auth/register');
        return
    }
    query = 'INSERT INTO users SET ?';
    con.query(query, newUser, function (err, records, fields) {
        if (err) console.log(err);
        console.log('User ' + newUser.email_id + ' added successfully');
        // req.flash('success', 'Welcome to workforce ' + newUser.first_name + ' ' + newUser.last_name);
        res.redirect('/');
    });
});

//logout
router.get('/logout', function (req, res) {
    req.logout();
    console.log('User Logged Out');
    res.redirect('/');
});


// ------------ Routes Finished ----------------//

module.exports = router;