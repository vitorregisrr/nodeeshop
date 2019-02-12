exports.get404 = (req, res, next) => {
    res.status(404).render('shop/404', {
        pageTitle: 'Error 404 - Not Found',
        path: '/404'
    });
};

exports.get500 = (error, req, res, next) => {
    res.status(500).render('shop/500', {
        pageTitle: 'Error 500 - Server Error',
        path: '/500',
        error: error
    });
};