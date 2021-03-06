var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    bcrypt = require('bcryptjs');

// ------------ Routes Started ----------------//

router.get('/', function (req, res) {
    res.send('auth');
});

// Auth Routes
// login
router.post('/login',
    passport.authenticate('local-user',
        {
            successRedirect: '/service/start',
            failureRedirect: '/',
            failureFlash: true
        }),
    function (req, res) {

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
    var con = req.app.get('con'); // MySQL Connection Object

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
    else { address += ' !' }
    address += tempAddress.pin + '!';
    address += tempAddress.city + '!';
    address += tempAddress.state;

    var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: address,
        email_id: req.body.email_id,
        phone_number: req.body.phone_number,
        profile_photo: req.body.profile_photo,
        password: req.body.password
    }

    if (repassword != newUser.password) {
        req.flash('error', 'Password and re-entered password must be same');
        req.flash('phone', newUser.phone_number);
        res.redirect('/auth/register');
        return
    }
    else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                newUser.password = hash;
                query = 'INSERT INTO users SET ?';
                con.query(query, newUser, function (err, records, fields) {
                    if (err) {
                        req.flash('phone', newUser.phone_number);
                        req.flash('error', 'Email-id already in use');
                        res.redirect('/auth/register');
                        return;
                    };
                    req.flash('success', 'Welcome to workforce ' + newUser.first_name + ' ' + newUser.last_name);
                    passport.authenticate('local-user')(req, res, function () {
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
    res.redirect('/');
});


// ------------ Routes Finished ----------------//

module.exports = router;