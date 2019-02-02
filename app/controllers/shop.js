const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(prods => {
            res.render('shop/products', {
                pageTitle: "Products List",
                prods: prods,
                path: "/products"
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.getById(prodID)
        .then(prod => {
            res.render('shop/product-detail', {
                pageTitle: "Product Detail",
                prod: prod,
                path: "/products"
            });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(prods => {
        res.render('shop/products', {
            pageTitle: "Products List",
            prods: prods,
            path: "/products"
        });
    })
    .catch(err => console.log(err));
};


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: "Início",
        path: "/checkout"
    });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then( prods => {
        res.render('shop/cart', {
            pageTitle: "Início",
            path: "/cart",
            prods
        });
    })
    .catch( err => console.log(err));

};

exports.addToCart = (req, res, next) => {
    const prodID = req.body.prodID;
    Product.getById(prodID)
    .then( prod => {
        return req.user.newCartProd(prod)
    })
    .then( () => {
        res.redirect('/cart');
    })
    .catch( err => console.log(err));
};

exports.removeFromCart = (req, res, next) => {
    const prodID = req.body.id;
    req.user.removeFromCart(prodID)
        .then( () => {
            res.redirect('/cart');
        })
        .catch( err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
    .then( orders => {
        res.render('shop/orders', {
            pageTitle: "My Orders",
            path: "/orders",
            orders: orders
        });
    })
    .catch(err => console.log(err));
};

exports.newOrder = (req, res, next) => {
    req.user.addOrder()
        .then( () => {
            res.redirect('/orders');
        })
        .catch( err => console.log(err));
}