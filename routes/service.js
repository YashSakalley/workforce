var express = require('express'),
    router = express.Router(),
    authenticate = require('./authenticate');

router.get('/start', authenticate.isLoggedIn, function (req, res) {
    res.render('startService');
});

router.get('/selectAddress/:service', authenticate.isLoggedIn, function (req, res) {
    address = req.user.address;
    address = address.split('!');

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

// ---------- DELETE THIS ROUTE -------------- //
router.get('/selectWorker/:service/:address', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object
    var service = req.params.service;
    var address = req.params.address;

    q = 'SELECT * FROM workers';
    con.query(q, function (err, workers, fields) {
        if (err) throw err;
        else {
            res.render('selectWorker', { service: service, address: address, workers: workers });
        }
    });
});

// ---------- DELETE THIS ROUTE -------------- //

router.get('/finish/:service/:address/:id', authenticate.isLoggedIn, function (req, res) {
    var service = req.params.service;
    var address = req.params.address;
    var status = 'pending';
    var con = req.app.get('con'); // MySQL Connection Object

    var id = req.params.id;
    q = 'SELECT * FROM temp_requests WHERE id = ' + id + ' AND user_id = ' + req.user.id;
    con.query(q, function (err, records, fields) {
        if (err) throw err;
        var temp_request = records[0];
        if (records.length == 0) {
            res.send('Access Denied');
            return
        }
        else {
            status = temp_request.current_status;
            job = temp_request.job;
            if (status == 'approved') {
                q = 'select * from requests join workers on requests.worker_id = workers.id where current_status = "ongoing" and requests.user_id = ? and requests.job = ?';
                con.query(q, [req.user.id, job], function (err, records, fields) {
                    if (err) throw err;
                    worker = records[0];
                    res.render('serviceFinish', { service: service, address: address, status: status, worker: worker });
                });
            }
            else {
                var worker = null;
                res.render('serviceFinish', { service: service, address: address, status: status, worker: worker });
            }
        }
    });

});

router.post('/finish', authenticate.isLoggedIn, function (req, res) {
    var selectedService = req.body.service;
    var selectedAddress = req.user.address;
    var isMap = req.body.map;
    console.log(isMap);
    if (isMap == 'true') {
        var lat = req.body.lat;
        var lng = req.body.lng;
        console.log('__map__,', lat, ',', lng);
        selectedAddress = '__map__,' + lat + ',' + lng;
    } else {
        console.log(selectedAddress);
    }
    var con = req.app.get('con'); // MySQL Connection Object

    var newRequest = {
        user_id: req.user.id,
        current_status: 'pending',
        job: selectedService,
        address: selectedAddress
    }

    q1 = 'SELECT * FROM temp_requests WHERE user_id = ? and job = ?';
    con.query(q1, [req.user.id, newRequest.job], function (err, records, fields) {
        if (records.length == 0) {
            q2 = 'INSERT INTO temp_requests SET ?';
            con.query(q2, newRequest, function (err, records, fields) {
                if (err) throw err;
                else {
                    var id = records.insertId;
                    res.redirect('/service/finish/' + selectedService + '/' + selectedAddress + '/' + id);
                }
            });
        }
        else {
            console.log('Request already created');
            req.flash('error', 'Request already created. Please select a new Service or try after this service is completed');
            res.redirect('/service/start');
        }
    });
});

router.get('/completed/:id', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object
    var id = req.params.id;
    var user = req.user.id;

    q = 'SELECT * FROM requests WHERE id = ? and user_id = ?'
    con.query(q, [id, user], function (err, records, fields) {
        if ((!records) || (records.length == 0)) {
            res.send('Invalid Request');
            return;
        }
        else {
            var order = records[0];
            res.render('completedOrder', { order: order });
        }
    });
});

module.exports = router;