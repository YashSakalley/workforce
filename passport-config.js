var LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcryptjs');

function initialize(passport, app, con) {
    const authenticateUser = (email, password, done) => {
        q = 'SELECT * FROM users WHERE email_id = ?';
        con.query(q, [email], async function (err, users) {
            if (err) throw err;
            user = users[0];
            if (user == null) {
                return done(null, false, { message: 'No user found with this email id' });
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, { user: user, role: 'role_user' });
                } else {
                    return done(null, false, { message: 'You have entered wrong password' })
                }
            } catch (e) {
                return done(e);
            }
        });
    }

    const authenticateWorker = (email, password, done) => {
        q = 'SELECT * FROM workers WHERE email_id = ?';
        con.query(q, [email], async function (err, workers) {
            if (err) throw err;
            worker = workers[0];
            if (worker == null) {
                return done(null, false, { message: 'No worker found' });
            }
            try {
                if (await bcrypt.compare(password, worker.password)) {
                    return done(null, { user: worker, role: 'role_worker' });
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

    passport.use('local-user', new LocalStrategy({ usernameField: 'email_id' }, authenticateUser));
    passport.use('local-worker', new LocalStrategy({ usernameField: 'email_id' }, authenticateWorker));

    passport.serializeUser(function (user, done) {
        var obj = {
            id: user.user.id,
            role: user.role
        }
        done(null, obj);
    });

    passport.deserializeUser(function (obj, done) {
        var role = obj.role;
        var id = obj.id;
        if (role == 'role_user') {
            con.query('SELECT * FROM users WHERE id = ?', [id], function (err, users, fields) {
                done(err, users[0]);
            });
        }
        else if (role == 'role_worker') {
            con.query('SELECT * FROM workers WHERE id = ?', [id], function (err, workers, fields) {
                done(err, workers[0]);
            });
        }
    });
}

module.exports = initialize;