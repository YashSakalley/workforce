var express = require('express'),
    router = express.Router(),
    config = require('../config/otp_config'),
    twilio = require('twilio'),
    client = twilio(config.accountSID, config.authToken);

// Show OTP Page
router.get('/:phone', function (req, res) {
    // msg = req.flash('msg');
    // var msg = 'Message comes here';
    var msg = null;
    phone = req.params.phone;
    res.render('verify', { phone: phone, msg: msg });
});

// Send OTP
router.post('/', function (req, res) {
    var phone = req.body.phone;
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
    res.redirect('/verify/' + phone);
});

// Verify OTP
router.post('/OTP', function (req, res) {
    var otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
    var phone = req.body.phone;
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
                res.redirect('/auth/register');
            }
            else {
                console.log('Otp is Wrong');
                res.redirect('back');
            }
        })
        .catch((err) => {
            console.log('err');
        });
});

module.exports = router;