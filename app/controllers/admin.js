const Product = require('../models/product');
//GET
exports.getAddProduct = (req, res, next) => {
    res.render('admin/new-product', {
        pageTitle: "Novo Produto",
        path: "admin/new-product",
        isLogged: req.user ? {name: req.user.name}  : false
    });
};

//POST
exports.addProduct = (req, res, next) => {
    const form = {
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        description: req.body.description,
        price: req.body.price,
        userId: req.user
    }
    console.log(form)
    new Product({...form})
        .save()
        .then( resul => {
            res.redirect('/products');
        })
        .catch( err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findById(prodID)
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
        imgUrl: req.body.imgUrl,
        description: req.body.description,
        price: req.body.price,
        id: req.body.id
    }
    Product.findById(form.id)
        .then(prod => {
            prod.title = form.title;
            prod.imgUrl = form.imgUrl;
            prod.description = form.description;
            prod.price = form.price;
            return prod.save();
        })
        .then(resul => {
            res.redirect('/products')
        })
        .catch(err => console.log(err));

}

exports.deleteProduct = (req, res, next) => {
    const prodID = req.body.id;
    Product.findByIdAndDelete(prodID)
        .then(resul => {
            res.redirect('/admin/products-list')
        })
        .catch(err => console.log(err));
};

exports.getProductList = (req, res, next) => {
    Product.find()
        .then(prods => {
            res.render('admin/products-list', {
                pageTitle: "Products ADMIN",
                prods: prods,
                path: "admin/products-list",
                isLogged: req.user ? {name: req.user.name}  : false
            });
        })
        .catch(err => console.log(err));
};