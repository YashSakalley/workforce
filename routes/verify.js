var express = require('express'),
    router = express.Router(),
    config = require('../config/otp_config'),
    twilio = require('twilio'),
    client = twilio(config.accountSID, config.authToken);

// Show OTP Page
router.get('/:phone/:role', function (req, res) {
    var phone = req.params.phone;
    var role = req.params.role;
    res.render('verify', { phone: phone, role: role });
});

// Send OTP
router.post('/', function (req, res) {
    var phone = req.body.phone;
    var role = req.body.role;
    var con = req.app.get('con') // MySQL Connection Object
    q = 'SELECT * FROM users WHERE phone_number = ?';
    con.query(q, phone, function (err, users, fields) {
        if (users.length != 0) {
            req.flash('error', 'User with the given phone number already exists');
            res.redirect('back');
            return;
        } else {
            console.log('/verify post', role);
            client
                .verify
                .services(config.serviceID)
                .verifications
                .create({
                    to: '+91' + phone,
                    channel: "sms"
                })
                .then((data) => {
                    console.log('OTP sent to ' + phone);
                })
                .catch((err) => {
                    console.log(err);
                    console.log('Error occured');
                });
            res.redirect('/verify/' + phone + '/' + role);
        }
    });
});

// Verify OTP
router.post('/OTP', function (req, res) {
    var otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
    var phone = req.body.phone;
    var role = req.body.role;
    console.log('role', role);
    client
        .verify
        .services(config.serviceID)
        .verificationChecks
        .create({
            to: '+91' + phone,
            code: otp
        })
        .then((value) => {
            if (value.valid == true) {
                console.log('Otp verified');
                req.flash('phone', phone);
                if (role == "worker") {
                    res.redirect('/worker/register');
                }
                else {
                    res.redirect('/auth/register');
                }
            }
            else {
                req.flash('error', 'OTP is wrong');
                console.log('Otp is Wrong');
                res.redirect('back');
            }
        })
        .catch((err) => {
            console.log('err');
        });
});

module.exports = router;