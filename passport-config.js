var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mangotree@123',
    database: 'workforce'
});

function initialize(passport, app) {
    const authenticateUser = (email, password, done) => {
        q = 'SELECT * FROM users WHERE email_id = ?';
        con.connect(function (err) {
            if (err) throw err;
            con.query(q, [email], async function (err, users) {
                if (err) console.log(err);
                user = users[0];
                if (user == null) {
                    console.log('Email id is incorrect');
                    return done(null, false, { message: 'No user found' });
                }
                try {
                    if (await bcrypt.compare(password, user.password)) {
                        console.log('User found successfully');
                        return done(null, user);
                    } else {
                        console.log('Password is incorrect');
                        return done(null, false, { message: 'Password Incorrect' })
                    }
                } catch (e) {
                    return done(e);
                }
            });
        });
    }

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy({ usernameField: 'email_id' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        con.connect(function (err) {
            con.query('SELECT * FROM users WHERE id = ?', [id], function (err, users, fields) {
                done(err, users[0]);
            });
        });
    });
}

module.exports = initialize;