var express = require('express'),
	router = express.Router();

router.get('/', function (req, res) {
	if (req.user) {
		console.log(req.user);
		console.log('there');
	}
	else {
		req.user = 1;
		console.log('here');
	}
	res.render('home');
});

module.exports = router;