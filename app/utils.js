function isLoggedIn(r) {
  return r?.session?.username != null;
}

function loginRequired(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  } else {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
}

function adminRequired(req, res, next) {
  if (req.session && req.session.username) {
    if (req.session.role === "admin") {
      return next();
    } else {
      return res.send("Access Denied!");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
}

export { isLoggedIn, loginRequired, adminRequired };
