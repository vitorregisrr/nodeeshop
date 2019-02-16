const Product = require('../models/product'),
    fs = require('fs');

const ITEMS_PER_PAGE = 8;
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
        imageUrl: req.file.path.replace(/app\Dpublic\D/, ''),
        description: req.body.description,
        price: req.body.price,
        userId: req.user,
    }
    new Product({
            ...form
        })
        .save()
        .then(resul => {
            res.redirect('/products');
        })
        .catch(err => next(new Error('Auth failed by a server-side error. Please, try again.', 500)));
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
        .catch(err => next(new Error('Auth failed by a server-side error. Please, try again.', 500)));
};


exports.postEditProduct = (req, res, next) => {
    const form = {
        title: req.body.title,
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
                return next( new Error('Product not founded, try again or contact us.'));
            }

            prod.title = form.title;
            prod.description = form.description;
            prod.price = form.price;

            if (req.file) {
                if (prod.imageUrl) {
                    fs.unlink(`app/public/${prod.imageUrl}`, err => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                prod.imageUrl = req.file.path.replace(/app\Dpublic\D/, '');
            }

            prod.save();
            return res.redirect('/products');
        })
        .catch(err => next(err));

}

exports.deleteProduct = (req, res, next) => {
    const prodID = req.params.productId;
    Product.findOneAndDelete({
            _id: prodID,
            userId: req.user
        })
        .then(prod => {
            if (!prod) {
                return res.redirect('/admin/products-list')
            }
            if (prod.imageUrl) {
                fs.unlink(`app/public/${prod.imageUrl}`, err => {
                    if (err) {
                        throw (err);
                    }
                });
            }

            return res.status (200).json({
                "message": "Success"
            });
        })
        .catch(err => {
            res.status(500).json({
                "message": "Error",
            });
        });
};

exports.getProductList = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let totalItems;

    Product.find()
    .countDocuments()
    .then(num => {
        totalItems = num;
        const totalPages = Math.ceil(totalItems/ITEMS_PER_PAGE);

        Product.find()
            .skip((currentPage - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
            .then(prods => {
                res.render('admin/products-list', {
                    pageTitle: "ADMIN Products List",
                    prods: prods,
                    path: "admin/products-list",
                    hasNext: currentPage < totalPages,
                    hasPrevious: currentPage > 1,
                    totalPages,
                    currentPage
                });
            })
        .catch(err => next(new Error(err, 500)));
        })
        .catch(err => next(new Error(err, 500)));
};