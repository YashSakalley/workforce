var express = require('express'),
    router = express.Router(),
    authenticate = require('./authenticate');

router.get('/start', function (req, res) {
    res.render('startService');
});

router.get('/selectAddress/:service', authenticate.isLoggedIn, function (req, res) {
    res.render('selectAddress', { service: req.params.service });
});

router.post('/selectAddress', authenticate.isLoggedIn, function (req, res) {
    var selectedService = req.body.service;
    res.redirect('/service/selectAddress/' + selectedService);
});

router.get('/selectWorker/:service/:address', authenticate.isLoggedIn, function (req, res) {
    var service = req.params.service;
    var address = req.params.address;
    console.log(service, address);

    res.render('selectWorker', { service: service, address: address });
});

router.post('/selectWorker', authenticate.isLoggedIn, function (req, res) {
    var selectedService = req.body.service;
    var selectedAddress = req.body.address;
    res.redirect('/service/selectWorker/' + selectedService + '/' + selectedAddress);
});

module.exports = router;