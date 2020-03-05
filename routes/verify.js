var express = require('express'),
    router = express.Router(),
    config = require('../config'),
    twilio = require('twilio'),
    client = twilio(config.accountSID, config.authToken);

// Show OTP Page
router.get('/:phone', function (req, res) {
    phone = req.params.phone;
    res.render('verify', { phone: phone });
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
            }
            else {
                console.log('Otp is Wrong');
            }
        })
        .catch((err) => {
            console.log('err');
        })
    console.log(otp);
    res.send('OTP Verification DONE');
});

module.exports = router;