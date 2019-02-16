const express = require('express'),
    router = express.Router(),
    adminCtrl = require('../controllers/admin'),
    isAuth = require('../middleware/is-auth'),
    validators = require('../middleware/validators');

router.post('/admin/new-product/', validators.product, isAuth, adminCtrl.addProduct);
router.get('/admin/new-product', isAuth, adminCtrl.getAddProduct);
router.get('/admin/edit-product/:prodID', isAuth, adminCtrl.getEditProduct);
router.post('/admin/edit-product/', validators.editProduct, isAuth, adminCtrl.postEditProduct);
router.delete('/admin/delete-product/:productId', isAuth, adminCtrl.deleteProduct);
router.get('/admin/products-list', isAuth, adminCtrl.getProductList);

module.exports = router;