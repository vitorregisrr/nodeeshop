const Product = require('../models/product'),
    User = require('../models/user'),
    Order = require('../models/order'),
    fs = require('fs'),
    path = require('path'),
    Pdf = require('pdfkit');

const ITEMS_PER_PAGE = 8;

exports.getProducts = (req, res, next) => {
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
                    res.render('shop/products', {
                        pageTitle: "Products List",
                        prods: prods,
                        path: "/products",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
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
        .catch(err => next(err, 500));
};


exports.getCheckout = (req, res, next) => {
  
};

exports.getCart = (req, res, next) => {
    User.findById(req.user)
        .populate('cart.items.product')
        .then(user => {
            res.render('shop/cart', {
                pageTitle: "Início",
                path: "/cart",
                prods: user.cart.items
            });
        })
        .catch(err => next(err, 500));
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
        .catch(err => next(err, 500));
};

exports.removeFromCart = (req, res, next) => {
    const prodId = req.body.id;
    req.user.removeFromCart(prodId)
        .then(resul => {
            res.redirect('/cart')
        })
        .catch(err => next(err, 500));
}

exports.getOrders = (req, res, next) => {
    Order.find({
            user: req.user
        })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: "My Orders",
                path: "/orders",
                orders: orders
            });
        })
        .catch(err => next(err, 500));
};

exports.newOrder = (req, res, next) => {
    req.user.newOrder()
        .then(() => {
            req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => next(err, 500));
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('app', 'data', 'invoices', invoiceName);
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('Order not founded. Please back and try again.'));

            }
            
            if (order.user.toString() == req.user._id.toString()) {

                res.setHeader('Content-Type', 'application/pdf')
                res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

                const pdfDoc = new Pdf();
                pdfDoc.pipe(fs.createWriteStream(invoicePath));
                pdfDoc.pipe(res);
                pdfDoc.fontSize(22).text(`Invoice ${orderId}`);
                pdfDoc.text('------------');
                pdfDoc.fontSize(15);
                let totalPrice = 0;
                order.items.forEach((p, i) => {
                    totalPrice += p.price * p.quantity;
                    pdfDoc.text(`${i+1}. ${p.title} - Price: ${p.price}$ - Quantity: ${p.quantity}`)
                    pdfDoc.text(`---------`);
                })
                pdfDoc.text(`---------`);
                pdfDoc.text(`Total Price: ${totalPrice}$`);
                return pdfDoc.end();

            } else {
                return next(new Error('You are not allowed to request this invoce. Please, try again or contact us.'));
            }

        })
        .catch(err => next(err));

}