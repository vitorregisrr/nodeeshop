const Product = require('../models/product');

//GET
exports.getAddProduct = (req, res, next) => {
    res.render('admin/new-product', {
        pageTitle: "Novo Produto",
        path: "admin/new-product",
    });
};

//POST
exports.addProduct = (req, res, next) => {
    const form = {
        title: req.body.title,
        img: req.body.img,
        desc: req.body.desc,
        price: req.body.price
    }
    const prod = new Product(form);
    prod.save();
    res.redirect('/products');
};

exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: "Edit Product",
        path: "admin/edit-product",
    });
};

exports.getProductList = (req, res, next) => {
    Product.fetchAll(prods => {
        res.render('admin/products-list', {
            pageTitle: "Products ADMIN",
            prods: prods,
            path: "admin/products-list"
        });
    });
};
