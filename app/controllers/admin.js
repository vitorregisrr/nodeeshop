const Product = require('../models/product');
//GET
exports.getAddProduct = (req, res, next) => {
    res.render('admin/new-product', {
        pageTitle: "Novo Produto",
        path: "admin/new-product",
        errorMessage: []
    });
};

//POST
exports.addProduct = (req, res, next) => {
    const form = {
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        description: req.body.description,
        price: req.body.price,
        userId: req.user,
    }
    console.log(form)
    new Product({
            ...form
        })
        .save()
        .then(resul => {
            res.redirect('/products');
        })
        .catch(err => next( new Error('Auth failed by a server-side error. Please, try again.', 500) ));
};

exports.getEditProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findOne({
            _id: prodID,
            userId: req.user
        })
        .then(prod => {
            if (!prod) {
                return res.redirect('/admin/products-list')
            }
            res.render('admin/edit-product', {
                pageTitle: "Editar Produto",
                path: "/edit-product",
                prod: prod,
                errorMessage: []
            })
        })
        .catch(err => next( new Error('Auth failed by a server-side error. Please, try again.', 500) ));
};


exports.postEditProduct = (req, res, next) => {
    const form = {
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        description: req.body.description,
        price: req.body.price,
        id: req.body.id
    }
    Product.findOne({
            _id: form.id,
            userId: req.user
        })
        .then(prod => {

            if (!prod) {
                return res.redirect('/admin/products-list')
            }

            prod.title = form.title;
            prod.imgUrl = form.imgUrl;
            prod.description = form.description;
            prod.price = form.price;
            return prod.save();
        })
        .then(resul => {
            res.redirect('/products')
        })
        .catch(err => next( new Error('Auth failed by a server-side error. Please, try again.', 500) ));

}

exports.deleteProduct = (req, res, next) => {
    const prodID = req.body.id;
    Product.findOneAndDelete({
            _id: prodID,
            userId: req.user
        })
        .then(prod => {
            if (!prod) {
                return res.redirect('/admin/products-list')
            }
            return res.redirect('/admin/products-list')
        })
        .catch(err => next( new Error('Auth failed by a server-side error. Please, try again.', 500) ));
};

exports.getProductList = (req, res, next) => {
    Product.find({
            userId: req.user
        })
        .then(prods => {
            res.render('admin/products-list', {
                pageTitle: "Products ADMIN",
                prods: prods,
                path: "admin/products-list"
            });
        })
        .catch(err => next( new Error('Auth failed by a server-side error. Please, try again.', 500) ));
};