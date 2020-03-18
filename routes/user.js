var express = require('express');
var router = express.Router();
var authenticate = require('./authenticate');

router.get('/', authenticate.isLoggedIn, function (req, res) {
    res.render('userProfile');
});

router.get('/currentOrders', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con');
    q = 'SELECT current_status, job, address, temp_requests.created_at, temp_requests.id ' +
        'FROM temp_requests JOIN users ON users.id = temp_requests.user_id ' +
        'WHERE user_id = ?';
    con.query(q, req.user.id, function (err, orders, fields) {
        res.render('currentOrders', { orders: orders });
    });
});

router.get('/pastOrders', authenticate.isLoggedIn, function (req, res) {
    var con = req.app.get('con');
    q = 'SELECT * FROM requests WHERE user_id = ?';
    con.query(q, req.user.id, function (err, orders, fields) {
        res.render('pastOrders', { orders: orders });
    });
});

module.exports = router;
