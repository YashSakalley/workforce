var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'sql12.freemysqlhosting.net',
    database: 'sql12332989',
    user: 'sql12332989',
    password: 'N9UgDC16BG'
});

con.connect(function (err) {
    if (err) console.log(err);
    console.log('Connected');
});

q1 = "CREATE TABLE users ( " +
    "id INT AUTO_INCREMENT PRIMARY KEY, " +
    "first_name VARCHAR(255), " +
    "last_name VARCHAR(255), " +
    "email_id VARCHAR(255) UNIQUE NOT NULL, " +
    "password VARCHAR(255) NOT NULL, " +
    "phone_number VARCHAR(10) UNIQUE NOT NULL, " +
    "address VARCHAR(255), " +
    "profile_photo VARCHAR(255), " +
    "created_at TIMESTAMP DEFAULT NOW() " +
    ");";

q2 = "CREATE TABLE workers ( " +
    "id INT AUTO_INCREMENT PRIMARY KEY, " +
    "first_name VARCHAR(255) NOT NULL, " +
    "last_name VARCHAR(255) NOT NULL, " +
    "email_id VARCHAR(255) UNIQUE NOT NULL, " +
    "password VARCHAR(255) NOT NULL, " +
    "phone_number VARCHAR(10) UNIQUE NOT NULL, " +
    "shop_address VARCHAR(255) NOT NULL, " +
    "profile_photo VARCHAR(255), " +
    "created_at TIMESTAMP DEFAULT NOW(), " +
    "average_rating FLOAT DEFAULT 0, " +
    "total_reviews INT DEFAULT 0 " +
    ");";

q3 = "CREATE TABLE reviews ( " +
    "id INT AUTO_INCREMENT PRIMARY KEY, " +
    "rating INT, " +
    "reviews_text VARCHAR(255), " +
    "worker_id INT, " +
    "user_id INT, " +
    "created_at TIMESTAMP DEFAULT NOW(), " +
    "request_id INT, " +
    "FOREIGN KEY(user_id) REFERENCES users(id), " +
    "FOREIGN KEY(worker_id) REFERENCES workers(id), " +
    "FOREIGN KEY(request_id) REFERENCES requests(id)" +
    ");"

q4 = "CREATE TABLE requests ( " +
    "id INT AUTO_INCREMENT PRIMARY KEY, " +
    "created_at TIMESTAMP DEFAULT NOW(), " +
    "user_id INT NOT NULL, " +
    "worker_id INT NOT NULL," +
    "current_status VARCHAR(20), " +
    "job VARCHAR(50), " +
    "address VARCHAR(255), " +
    "cost float DEFAULT 0, " +
    "FOREIGN KEY(user_id) REFERENCES users(id), " +
    "FOREIGN KEY(worker_id) REFERENCES workers(id) " +
    ");";

q5 = "CREATE TABLE temp_requests ( " +
    "id INT AUTO_INCREMENT PRIMARY KEY, " +
    "user_id INT NOT NULL, " +
    "created_at TIMESTAMP DEFAULT NOW(), " +
    "address VARCHAR(255), " +
    "current_status VARCHAR(20), " +
    "job VARCHAR(50) NOT NULL, " +
    "FOREIGN KEY(user_id) REFERENCES users(id) " +
    ");"

/*
con.query(q1, function (err, records, fields) {
    if (err) throw err;
    console.log('Added users table');
});
con.query(q2, function (err, records, fields) {
    if (err) throw err;
    console.log('Added workers table');
});*/
con.query(q3, function (err, records, fields) {
    if (err) throw err;
    console.log('Added reviews table');
});
/*con.query(q4, function (err, records, fields) {
    if (err) throw err;
    console.log('Added requests table');
});*/
/*con.query(q5, function (err, records, fields) {
    if (err) throw err;
    console.log('Added temp_requests table');
});*/
con.end();