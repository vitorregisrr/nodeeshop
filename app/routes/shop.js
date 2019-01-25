const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shop');

router.get('/', shopCtrl.getIndex);
router.get('/products', shopCtrl.getProducts);
// router.get('/products/delete', shopCtrl.deleteProduct);
router.get('/products/:prodID', shopCtrl.getProduct);
router.get('/checkout', shopCtrl.getCheckout);
router.get('/cart', shopCtrl.getCart);
router.post('/cart', shopCtrl.addToCart);
router.get('/orders', shopCtrl.getOrders);

module.exports = router;