function initDb(mysql) {
    var con = mysql.createConnection({
        host: 'localhost',
        database: 'workforce',
        user: '',
        password: ''
    });
    return con;
}

module.exports = initDb;