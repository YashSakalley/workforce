var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    var con = req.app.get('con');
    q = 'SELECT * FROM requests;'
    con.query(q, function (err, records, fields) {
        if (err) throw err;
        console.log(records);
    });
    res.send('end');
});

module.exports = router;