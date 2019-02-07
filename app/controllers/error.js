exports.get404 = (req, res, next) => {
    res.status(404).render('shop/404', {
        pageTitle: 'Error 404 - Not Found',
        path: '/404',
        isLogged: req.user ? {name: req.user.name}  : false
    });
};