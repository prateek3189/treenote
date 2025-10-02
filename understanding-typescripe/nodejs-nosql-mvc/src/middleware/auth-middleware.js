"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = auth;
function auth(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return next();
    }
    res.locals.isAdmin = user.user_type === "A";
    next();
}
