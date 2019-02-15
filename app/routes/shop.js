const express = require('express'),
    router = express.Router(),
    isAuth = require('../middleware/is-auth'),
    setLocals = require('../middleware/set-locals'),
    shopCtrl = require('../controllers/shop'),
    csurf = require('csurf'),
    csurfProtection = csurf({cookie:false});

router.get('/', csurfProtection, setLocals, shopCtrl.getIndex);
router.get('/products', csurfProtection, shopCtrl.getProducts);
router.get('/products/:prodID', csurfProtection, shopCtrl.getProduct);
router.get('/checkout', csurfProtection, setLocals,  isAuth, shopCtrl.getCheckout);
router.get('/cart', csurfProtection, setLocals, isAuth, shopCtrl.getCart);
router.post('/cart/new', csurfProtection, setLocals, isAuth, shopCtrl.addToCart);
router.post('/cart/delete', csurfProtection, setLocals, isAuth, shopCtrl.removeFromCart);
router.get('/orders', csurfProtection, setLocals, isAuth, shopCtrl.getOrders);
router.post('/orders/new', csurfProtection, setLocals, isAuth, shopCtrl.newOrder);
router.get('/orders/getInvoice/:orderId', csurfProtection, setLocals, isAuth, shopCtrl.getInvoice);

module.exports = router;