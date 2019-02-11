const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(prods => {
            res.render('shop/products', {
                pageTitle: "Products List",
                prods: prods,
                path: "/products"
            });
        })
         .catch(err => next( new Error('Request failed by a server-side error. Please, try again.', err, 500) ));
};

exports.getProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findById(prodID)
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
    Product.find()
        .then(prods => {
            res.render('shop/index', {
                pageTitle: "Início",
                prods: prods,
                path: "/"
            });
        })
         .catch(err => next( new Error('Request failed by a server-side error. Please, try again.', err, 500) ));
};


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: "Início",
        path: "/checkout",
        isLogged: req.user ? {name: req.user.name} : false
    });
};

exports.getCart = (req, res, next) => {
    User.findById(req.user)
        .populate('cart.items.productId')
        .then(user => {
            res.render('shop/cart', {
                pageTitle: "Início",
                path: "/cart",
                prods: user.cart.items
            });
        })
         .catch(err => next( new Error('Request failed by a server-side error. Please, try again.', err, 500) ));
};

exports.addToCart = (req, res, next) => {
    const prodID = req.body.prodID;
    Product.findById(prodID)
        .then(prod => {
            return req.user.addToCart(prod)
        })
        .then(() => {
            res.redirect('/cart');
        })
         .catch(err => next( new Error('Request failed by a server-side error. Please, try again.', err, 500) ));
};

exports.removeFromCart = (req, res, next) => {
    const prodId = req.body.id;
    req.user.removeFromCart(prodId)
        .then(resul => {
            res.redirect('/cart')
        })
         .catch(err => next( new Error('Request failed by a server-side error. Please, try again.', err, 500) ));
}

exports.getOrders = (req, res, next) => {
    Order.find( {user: req.user})
        .populate('items.productId')
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: "My Orders",
                path: "/orders",
                orders: orders
            });
        })
         .catch(err => next( new Error('Request failed by a server-side error. Please, try again.', err, 500) ));
};

exports.newOrder = (req, res, next) => {
    req.user.newOrder()
        .then( () => {
            req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
         .catch(err => next( new Error('Request failed by a server-side error. Please, try again.', err, 500) ));
}