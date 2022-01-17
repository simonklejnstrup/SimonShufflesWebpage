
export function isAuthorized(req, res, next) {
    !req.session.isLoggedIn ? res.redirect("/") : next()
}

export function isAdmin(req, res, next) {
    !req.session.isAdmin ? res.redirect("/") : next()
}

export function getUserFromSession(req) {
    return req.session.user;    
}   