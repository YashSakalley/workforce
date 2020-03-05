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

q = 'SELECT * FROM users where email_id = ?';
email_id = 'fake@fake.com';
con.query(q, [email_id], function (err, user) {
    if (err) console.log(err);
    console.log(user[0]);
});

con.end();