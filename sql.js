var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    database: 'workforce',
    user: 'root',
    password: 'Mangotree@123'
});

con.connect(function (err) {
    if (err) console.log(err);
    console.log('Connected');
});

/*
q = 'SELECT * FROM users where email_id = ?';
email_id = 'yashsakalley98@gmail.com';

con.query(q, [email_id], function (err, user) {
    if (err) throw err;

    if (user.length == 0) {
        console.log('No user found');
    }
    else {
        console.log('Found user', user[0]);
    }
});
*/

q = 'DELETE FROM temp_requests WHERE id = ?';
con.query(q, 1, function (err, records, fields) {
    console.log('records', records);
    console.log('fields', fields);
});

con.end();