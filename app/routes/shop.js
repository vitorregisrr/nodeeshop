const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shop');

router.get('/', shopCtrl.getIndex);
router.get('/products', shopCtrl.getProducts);
router.get('/products/:prodID', shopCtrl.getProduct);
router.get('/checkout', shopCtrl.getCheckout);
router.get('/cart', shopCtrl.getCart);
router.post('/cart/new', shopCtrl.addToCart);
router.post('/cart/delete', shopCtrl.removeFromCart);
router.get('/orders', shopCtrl.getOrders);
router.post('/orders/new', shopCtrl.newOrder);

module.exports = router;