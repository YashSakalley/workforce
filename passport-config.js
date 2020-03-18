var LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcryptjs');

function initialize(passport, app, con) {
    const authenticateUser = (email, password, done) => {

        q = 'SELECT * FROM users WHERE email_id = ?';
        con.query(q, [email], async function (err, users) {
            if (err) throw err;
            user = users[0];
            if (user == null) {
                return done(null, false, { message: 'No user found' });
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password Incorrect' })
                }
            } catch (e) {
                return done(e);
            }
        });
    }

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy({ usernameField: 'email_id' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        con.query('SELECT * FROM users WHERE id = ?', [id], function (err, users, fields) {
            done(err, users[0]);
        });
    });
}

module.exports = initialize;