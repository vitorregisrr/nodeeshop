module.exports = (req, res, next) => {
    res.locals.isLogged = req.user ? {
        name: req.user.name
    } : null;
    res.locals.csrfToken = req.csrfToken();
    return next();
};