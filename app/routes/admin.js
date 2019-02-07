const express = require('express'),
router = express.Router(),
adminCtrl = require('../controllers/admin'),
isAuth = require('../middleware/is-auth');


router.post('/admin/new-product', isAuth, adminCtrl.addProduct);
router.get('/admin/new-product',  isAuth, adminCtrl.getAddProduct);
router.get('/admin/edit-product/:prodID', isAuth, adminCtrl.getEditProduct);
router.post('/admin/edit-product/', isAuth, adminCtrl.postEditProduct);
router.post('/admin/delete-product/', isAuth, adminCtrl.deleteProduct);
router.get('/admin/products-list', isAuth, adminCtrl.getProductList);

module.exports = router;