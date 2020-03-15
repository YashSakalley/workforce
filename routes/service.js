var express = require('express'),
    router = express.Router(),
    authenticate = require('./authenticate'),
    mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mangotree@123',
    database: 'workforce'
})

router.get('/start', authenticate.isLoggedIn, function (req, res) {
    res.render('startService');
});

router.get('/selectAddress/:service', authenticate.isLoggedIn, function (req, res) {
    address = req.user.address;
    address = address.split('!');
    console.log(address);
    var addline1 = address[0] + ', ' + address[1];
    var addline2 = address[2];
    var addline3 = address[4] + ', ' + address[5];
    var addline4 = address[3];
    var address = {
        line1: addline1,
        line2: addline2,
        line3: addline3,
        line4: addline4
    }
    res.render('selectAddress', { service: req.params.service, address: address });
});

router.post('/selectAddress', authenticate.isLoggedIn, function (req, res) {
    var selectedService = req.body.service;
    res.redirect('/service/selectAddress/' + selectedService);
});

router.get('/selectWorker/:service/:address', authenticate.isLoggedIn, function (req, res) {
    var service = req.params.service;
    var address = req.params.address;
    console.log(service, address);

    con.connect(function (err) {
        q = 'SELECT * FROM workers';
        con.query(q, function (err, workers, fields) {
            if (err) console.log(err);
            else {
                console.log('Workers are:', workers);
                res.render('selectWorker', { service: service, address: address, workers: workers });
            }
        });
    });
});

router.get('/finish/:service/:address', function (req, res) {
    var service = req.params.service;
    var address = req.params.address;
    // con.connect(function(err){
    //     q = 'INSERT INTO ';
    //     con.query(q, )
    // });

    res.render('serviceFinish', { service: service, address: address });
});

router.post('/finish', authenticate.isLoggedIn, function (req, res) {
    var selectedService = req.body.service;
    var selectedAddress = req.body.address;
    res.redirect('/service/finish/' + selectedService + '/' + selectedAddress);
});

module.exports = router;