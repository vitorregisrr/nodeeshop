const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(prods => {
        res.render('shop/products', {
            pageTitle: "Products List",
            prods: prods,
            path: "/products"
        });
    });
};

exports.getProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.getProd(prodID, (prod) => {
        res.render('shop/product-detail', {
            pageTitle: "Products List",
            prod: prod,
            path: "/products"
       });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(prods => {
        res.render('shop/index', {
            pageTitle: "Início",
            prods: prods,
            path: "/"
        });
    });
};


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: "Início",
        path: "/checkout"
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: "Carrinho",
        path: "/cart"
    });
};

exports.addToCart = (req, res, next) => {
    const prodID = req.body.prodID;
    Product.getProd(prodID, (prod) => {
        Cart.new(prod.id, parseFloat(prod.price));
    });
    res.redirect('/cart')
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: "My Orders",
        path: "/orders"
    });
};

exports.getProductDetail = (req, res, next) => {
    res.render('shop/product-detail', {
        pageTitle: "Detalhes do Produto",
        path: "/product-detail"
    });
};
