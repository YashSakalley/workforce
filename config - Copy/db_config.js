function initDb(mysql) {
    var con = mysql.createConnection({
        host: 'localhost',
        user: '',
        password: '',
        database: 'workforce'
    });

    return con;
}

module.exports = initDb;