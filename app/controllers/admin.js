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
        price: req.body.price,
        userId: req.user._id
    }
    new Product(form)
        .save()
        .then(resul => {
            res.redirect('/admin/products-list');
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.getById(prodID)
        .then(prod => {
            res.render('admin/edit-product', {
                pageTitle: "Editar Produto",
                path: "/edit-product",
                prod: prod
            })
        })
        .catch(err => {
            console.log(err)
        });
};


exports.postEditProduct = (req, res, next) => {
    const form = {
        title: req.body.title,
        img: req.body.img,
        desc: req.body.desc,
        price: req.body.price,
        id: req.body.id
    }
    new Product(form)
        .update()
        .then(resul => {
            res.redirect('/admin/products-list');
        })
        .catch(err => console.log(err));

}

exports.deleteProduct = (req, res, next) => {
    const prodID = req.body.id;
    Product.deleteById(prodID)
        .then(resul => {
            res.redirect('/admin/products-list')
        })
        .catch(err => console.log(err));
};

exports.getProductList = (req, res, next) => {
    Product.fetchAll()
        .then(prods => {
            res.render('admin/products-list', {
                pageTitle: "Products ADMIN",
                prods: prods,
                path: "admin/products-list"
            });
        })
        .catch(err => console.log(err));
};