var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mysql = require('mysql'),
    bcrypt = require('bcryptjs');

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

// Auth Routes
// login
router.post('/login',
    passport.authenticate('local',
        {
            successRedirect: '/service/start',
            failureRedirect: '/',
            failureFlash: true
        }),
    function (req, res) {
        console.log('Logged In user.');
    });

router.get('/login', function (req, res) {
    res.render('login');
});

// register 
router.get('/register', function (req, res) {
    phone = req.flash('phone');
    res.render('register', { phone: phone });
});

router.post('/register', function (req, res) {
    repassword = req.body.repassword;
    password = req.body.password;

    tempAddress = {
        house_number: req.body.house_number,
        add1: req.body.add1,
        add2: req.body.add2,
        pin: req.body.pin,
        city: req.body.city,
        state: req.body.state
    }

    address = tempAddress.house_number + '!';
    address += tempAddress.add1 + '!';
    if (tempAddress.add2) { address += tempAddress.add2 + '!' }
    address += tempAddress.pin + '!';
    address += tempAddress.city + '!';
    address += tempAddress.state;

    console.log(address);

    var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: address,
        email_id: req.body.email_id,
        phone_number: req.body.phone_number,
        profile_photo: req.body.profile_photo,
        password: req.body.password
    }
    const hashedPassword = bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    if (repassword != newUser.password) {
        console.log(password, repassword);
        req.flash('error', 'Password and re-entered password must be same');
        console.log('password error');
        res.redirect('/auth/register');
        return
    }
    else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                newUser.password = hash;
                query = 'INSERT INTO users SET ?';
                con.query(query, newUser, function (err, records, fields) {
                    if (err) console.log(err);
                    console.log('User ' + newUser.email_id + ' added successfully');
                    req.flash('success', 'Welcome to workforce ' + newUser.first_name + ' ' + newUser.last_name);
                    passport.authenticate('local')(req, res, function () {
                        req.flash('success', 'Welcome to Workforce' + newUser.email_id);
                        res.redirect('/service/start');
                    });
                });
            });
        });
    }
});

//logout
router.get('/logout', function (req, res) {
    req.logout();
    console.log('User Logged Out');
    res.redirect('/');
});


// ------------ Routes Finished ----------------//

module.exports = router;