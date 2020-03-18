var authenticate = {
    isLoggedIn: isLoggedIn,
    isNotLoggedIn: isNotLoggedIn
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = authenticate;