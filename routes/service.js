var express = require('express'),
    router = express.Router(),
    authenticate = require('./authenticate');

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
    var con = req.app.get('con'); // MySQL Connection Object

    var service = req.params.service;
    var address = req.params.address;
    console.log(service, address);

    q = 'SELECT * FROM workers';
    con.query(q, function (err, workers, fields) {
        if (err) console.log(err);
        else {
            console.log('Workers are:', workers);
            res.render('selectWorker', { service: service, address: address, workers: workers });
        }
    });
});

router.get('/finish/:service/:address/:id', authenticate.isLoggedIn, function (req, res) {
    var service = req.params.service;
    var address = req.params.address;
    var status = 'pending';
    var con = req.app.get('con');

    var id = req.params.id;
    var user_id = req.user.id;
    q = 'SELECT * FROM temp_requests WHERE id = ' + id + ' AND user_id = ' + req.user.id;
    console.log(q);
    con.query(q, function (err, records, fields) {
        var temp_request = records[0];
        if (err) console.log(err);
        if (records.length == 0) {
            res.render('home');
            console.log('access denied');
            return
        }
        else {
            console.log(records);
            status = temp_request.current_status;
        }
        res.render('serviceFinish', { service: service, address: address, status: status });
    });

});

router.post('/finish', authenticate.isLoggedIn, function (req, res) {
    var selectedService = req.body.service;
    var selectedAddress = req.body.address;
    var con = req.app.get('con');

    console.log('Request Recieved');
    var newRequest = {
        user_id: req.user.id,
        current_status: 'pending',
        job: selectedService
    }
    q = 'INSERT INTO temp_requests SET ?';
    con.query(q, newRequest, function (err, records, fields) {
        console.log('inserting');
        if (err) console.log(err);
        else {
            var id = records.insertId;
            console.log('it is', id);
            res.redirect('/service/finish/' + selectedService + '/' + selectedAddress + '/' + id);
        }
    });

});

module.exports = router;