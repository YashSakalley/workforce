function initDb(mysql) {
    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Mangotree@123',
        database: 'workforce'
    });
    // var con = mysql.createConnection({
    //     host: 'sql12.freemysqlhosting.net',
    //     database: 'sql12332989',
    //     user: 'sql12332989',
    //     password: 'N9UgDC16BG'
    // });
    return con;
}

module.exports = initDb;