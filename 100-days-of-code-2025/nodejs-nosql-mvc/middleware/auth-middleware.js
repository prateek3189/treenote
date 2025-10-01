function auth(req, res, next) {
  const user = req.session.user;

  if (!user) {
    return next();
  }

  res.locals.isAdmin = user.user_type === "A";
  next();
}

module.exports = auth;
