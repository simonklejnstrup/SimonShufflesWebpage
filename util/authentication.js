
export function isAuthorized(req) {
    !req.session.isLoggedIn ? res.redirect("/login") : next()
}

export function isAdmin(req) {
    return req.session.isAdmin;
}

export function getUserFromSession(req) {
    return req.session.user;    
}   