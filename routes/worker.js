var express = require('express'),
    router = express.Router(),
    mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mangotree@123',
    database: 'workforce'
});

con.connect(function (err) {
    if (err) throw err;
});
router.get('/', function (req, res) {
    q = 'SELECT first_name, last_name, phone_number, address, temp_requests.id, job, user_id ' +
        'FROM temp_requests JOIN users ' +
        'ON users.id = temp_requests.user_id ' +
        'WHERE temp_requests.current_status = "pending"';
    con.query(q, function (err, requests, fields) {
        console.log('Requests', requests);
        if (requests.length == 0) {
            var empty = [];
            res.render('worker', { empty: requests });
        }
        res.render('worker', { requests: requests });
    });
});

router.post('/selectJob', function (req, res) {
    var request = JSON.parse(req.body.jobId);
    var worker_id = 1;

    var newRequest = {
        user_id: request.user_id,
        worker_id: worker_id,
        current_status: 'approved',
        job: request.job
    }
    q1 = 'INSERT INTO requests SET ?'
    con.query(q1, newRequest, function (err, records, fields) {
        if (err) throw err;
        console.log('main', records);
        q2 = 'UPDATE temp_requests SET current_status = ? WHERE id = ? ';
        con.query(q2, ['approved', request.id], function (err, records, fields) {
            if (err) throw err;
            res.send('done');
        });
    });
});

module.exports = router;