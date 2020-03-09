var express = require('express');
var router = express.Router();
var authenticate = require('./authenticate');

router.get('/', authenticate.isLoggedIn, function (req, res) {
    res.render('userProfile');
});

module.exports = router;
