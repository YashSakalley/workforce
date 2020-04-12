function initDb(mysql) {
    var con = mysql.createConnection({
        host: 'sql12.freemysqlhosting.net',
        database: 'sql12332989',
        user: 'sql12332989',
        password: 'N9UgDC16BG'
    });
    return con;
}

module.exports = initDb;