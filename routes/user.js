var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function (req, res) {
    res.send('User Logged in');
});

router.get('/user', function (req, res) {
    var user = {
        first_name: "Yash",
        last_name: "Sakalley",
        email_id: "yashsakalley98@gmail.com",
        profile_photo: "https://qph.fs.quoracdn.net/main-qimg-11ef692748351829b4629683eff21100.webp",
        address: "Govindpura",
        created_at: Date(Date.now()),
        phone_number: "9406511336"
    }
    res.render('userProfile', { user: user });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('LogIn check successfull');
        return next();
    }
    console.log('Should be logged in');
    res.send('Should login first');
}

module.exports = router;
