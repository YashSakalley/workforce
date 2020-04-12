var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    bcrypt = require('bcryptjs'),
    authenticate = require('./authenticate');

// HOME
router.get('/', function (req, res) {
    res.render('workerLanding');
});

// Login - POST
router.post('/login',
    passport.authenticate('local-worker',
        {
            successRedirect: '/worker/selectJob',
            failureRedirect: '/worker',
            failureFlash: true
        }),
    function (req, res) {

    });

// Register - GET
router.get('/register', function (req, res) {
    phone = req.flash('phone');
    res.render('workerRegister', { phone: phone });
});

// Register - POST
router.post('/register', function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object

    repassword = req.body.repassword;
    password = req.body.password;

    tempAddress = {
        house_number: req.body.house_number,
        add1: req.body.add1,
        add2: req.body.add2,
        pin: req.body.pin,
        city: req.body.city,
        state: req.body.state
    }

    address = tempAddress.house_number + '!';
    address += tempAddress.add1 + '!';
    if (tempAddress.add2) { address += tempAddress.add2 + '!' }
    else { address += ' !' }
    address += tempAddress.pin + '!';
    address += tempAddress.city + '!';
    address += tempAddress.state;

    var newWorker = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        shop_address: address,
        email_id: req.body.email_id,
        phone_number: req.body.phone_number,
        profile_photo: req.body.profile_photo,
        password: req.body.password
    }

    if (repassword != newWorker.password) {
        req.flash('error', 'Password and re-entered password must be same');
        res.redirect('/worker/register');
        return
    }
    else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                newWorker.password = hash;
                query = 'INSERT INTO workers SET ?';
                con.query(query, newWorker, function (err, records, fields) {
                    if (err) {
                        req.flash('phone', newUser.phone_number);
                        req.flash('error', 'Email-id already in use');
                        res.redirect('/worker/register');
                        return;
                    };
                    req.flash('success', 'Welcome to workforce ' + newWorker.first_name + ' ' + newWorker.last_name);
                    passport.authenticate('local-worker')(req, res, function () {
                        req.flash('success', 'Welcome to Workforce' + newWorker.email_id);
                        res.redirect('/worker/selectJob');
                    });
                });
            });
        });
    }
});

//logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/worker');
});

// Select Job - GET
router.get('/selectJob', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object

    q = 'SELECT first_name, last_name, phone_number, temp_requests.address as address, temp_requests.id, job, user_id ' +
        'FROM temp_requests JOIN users ' +
        'ON users.id = temp_requests.user_id ' +
        'WHERE temp_requests.current_status = "pending"';
    con.query(q, function (err, requests, fields) {
        if (err) throw err;
        if (requests.length == 0) {
            var requests = [];
            res.render('worker', { requests: requests });
            return;
        }
        res.render('worker', { requests: requests });
    });
});

// Select Job - POST
router.post('/selectJob', function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object

    var request = JSON.parse(req.body.jobId);
    var address = req.body.address;
    var worker_id = req.user.id;

    var newRequest = {
        user_id: request.user_id,
        worker_id: worker_id,
        current_status: 'ongoing',
        job: request.job,
        address: address
    }
    console.log('address', address);
    q = 'SELECT * FROM requests WHERE worker_id = ?'
    con.query(q, worker_id, function (err, records, fields) {
        if (records.length == 0) {
            q1 = 'INSERT INTO requests SET ?';
            con.query(q1, newRequest, function (err, records, fields) {
                if (err) throw err;
                q2 = 'UPDATE temp_requests SET current_status = ? WHERE id = ? ';
                con.query(q2, ['approved', request.id], function (err, records, fields) {
                    if (err) throw err;
                    res.send('done');
                });
            });
        } else {
            req.flash('error', 'You already have a job assigned to you. New jobs can be taken only after finishing previous work.');
            res.redirect('/worker/selectJob');
        }
    });

});

// Current Jobs - GET
router.get('/currentJobs', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object
    q = 'SELECT * FROM requests WHERE worker_id = ? and current_status = "ongoing"';
    con.query(q, req.user.id, function (err, jobs, fields) {
        if (err) throw err;
        console.log(jobs);
        res.render('currentJobs', { jobs: jobs });
    });
});

// Past Jobs - GET
router.get('/pastJobs', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con'); // MySQL Connection Object
    q = 'SELECT * FROM requests WHERE worker_id = ? and current_status = "completed"';
    con.query(q, req.user.id, function (err, jobs, fields) {
        if (err) throw err;
        console.log(jobs);
        res.render('pastJobs', { jobs: jobs });
    });
});

module.exports = router;