const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin');

router.post('/admin/new-product', adminCtrl.addProduct);
router.get('/admin/new-product', adminCtrl.getAddProduct);
router.get('/admin/edit-product', adminCtrl.getEditProduct);
router.get('/admin/products-list', adminCtrl.getProductList);

module.exports = router;