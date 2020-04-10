var express = require('express'),
	router = express.Router();

// Landing Page
router.get('/', function (req, res) {
	res.render('home');
});

// Contact Us Page
router.get('/contactUs', function (req, res) {
	res.render('notFound');
});

// Feedback Page
router.get('/feedback', function (req, res) {
	res.render('notFound');
});

module.exports = router;