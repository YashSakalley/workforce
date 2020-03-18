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

router.get('/finish/:service/:address/:id', authenticate.isLoggedIn, function (req, res) {
    var service = req.params.service;
    var address = req.params.address;
    var status = 'pending';
    var con = req.app.get('con');

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
            if (status == 'approved') {
                /*
                q = 'SELECT requests.id, workers.id, workers.job, first_name, last_name, phone_number,' +
                    'email_id, shop_address, profile_photo, average_rating, total_reviews ' +
                    'FROM requests JOIN workers ON workers.id = requests.worker_id;';
                con.query(q, funtion(err, records, fields) {

                });
                */
                var testWorker = {
                    first_name: 'Rick',
                    last_name: 'Hayes',
                    email_id: 'Rick_hayes59@gmail.com',
                    phone_number: '9876543210',
                    average_rating: '4.2',
                    total_reviews: '3'
                }
                res.render('serviceFinish', { service: service, address: address, status: status, worker: testWorker });
            }
            else {
                /*
                var worker = {
                    first_name: 'Rick',
                    last_name: 'Hayes',
                    email_id: 'Rick_hayes59@gmail.com',
                    phone_number: '9876543210',
                    average_rating: '4.2',
                    total_reviews: '3'
                };
                */
                var worker = null;
                res.render('serviceFinish', { service: service, address: address, status: status, worker: worker });
            }
        }
    });

});

router.post('/finish', authenticate.isLoggedIn, function (req, res) {
    var selectedService = req.body.service;
    var selectedAddress = req.body.address;
    var con = req.app.get('con');

    var newRequest = {
        user_id: req.user.id,
        current_status: 'pending',
        job: selectedService
    }
    q = 'INSERT INTO temp_requests SET ?';
    con.query(q, newRequest, function (err, records, fields) {
        if (err) throw err;
        else {
            var id = records.insertId;
            res.redirect('/service/finish/' + selectedService + '/' + selectedAddress + '/' + id);
        }
    });

});

module.exports = router;