const express = require('express'),
    router = express.Router(),
    isAuth = require('../middleware/is-auth'),
    shopCtrl = require('../controllers/shop');

router.get('/', shopCtrl.getIndex);
router.get('/products', shopCtrl.getProducts);
router.get('/products/:prodID', shopCtrl.getProduct);
router.get('/checkout', isAuth, shopCtrl.getCheckout);
router.get('/cart', isAuth, shopCtrl.getCart);
router.post('/cart/new', isAuth, shopCtrl.addToCart);
router.post('/cart/delete', isAuth, shopCtrl.removeFromCart);
router.get('/orders', isAuth, shopCtrl.getOrders);
router.post('/orders/new', isAuth, shopCtrl.newOrder);
router.get('/orders/getInvoice/:orderId', isAuth, shopCtrl.getInvoice);

module.exports = router;