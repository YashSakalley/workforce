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
            req.flash('error', 'Request already created for this service. Please select a different service or try after the current service is completed');
            res.redirect('/service/start');
        }
    });
});

router.get('/completed/:id', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object
    var id = req.params.id;
    var worker = req.user.id;

    q = 'SELECT ' +
        'requests.job as job, ' +
        'requests.created_at as created_at, ' +
        'requests.address as address, ' +
        'requests.current_status as current_status, ' +
        'requests.cost as cost, ' +
        'requests.id as id, ' +
        'workers.id as worker_id, ' +
        'workers.first_name as first_name, ' +
        'workers.last_name as last_name, ' +
        'workers.phone_number as phone_number, ' +
        'workers.average_rating as average_rating ' +
        'FROM requests JOIN workers ' +
        'ON requests.worker_id = workers.id WHERE requests.id = ? ';

    con.query(q, [id, worker], function (err, records, fields) {
        if ((!records) || (records.length == 0)) {
            res.send('Invalid Request');
            return;
        }
        else {
            var order = records[0];
            q1 = 'SELECT * FROM reviews WHERE request_id = ?';
            con.query(q1, id, function (err, records, fields) {
                if (records.length == 0) {
                    res.render('completedOrder', { order: order, review: '' });
                }
                else {
                    var review = records[0];
                    res.render('completedOrder', { order: order, review: review });
                }
            });
        }
    });
});

router.post('/review', authenticate.isLoggedIn, function (req, res) {
    console.log(req.body);
    var con = req.app.get('con'); // MySQL Connection Object
    var newReview = {
        rating: req.body.rating,
        reviews_text: req.body.review,
        worker_id: req.body.worker_id,
        user_id: req.user.id,
        request_id: req.body.request_id
    }
    q = 'INSERT INTO reviews SET ?';
    con.query(q, newReview, function (err, records, fields) {
        if (err) throw err;
        console.log('Review added');
        res.redirect('/service/completed/' + newReview.request_id);
    });

    // Updating the values for worker
    q2 = 'SELECT average_rating, total_reviews FROM workers WHERE id = ?';
    con.query(q2, newReview.worker_id, function (err, records, fields) {
        var worker = records[0];
        var rating = parseFloat(worker.average_rating);
        var total = parseFloat(worker.total_reviews);
        var newRating = parseFloat(newReview.rating);

        var new_average = ((rating * total) + newRating) / (total + 1);
        total += 1;

        q3 = 'UPDATE workers SET average_rating = ?, total_reviews = ? WHERE id = ?';
        con.query(q3, [new_average, total, newReview.worker_id], function (err, records, fields) {
            if (err) throw err;
        });
    })
});

module.exports = router;