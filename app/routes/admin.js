const express = require('express'),
    router = express.Router(),
    adminCtrl = require('../controllers/admin'),
    isAuth = require('../middleware/is-auth'),
    validators = require('../middleware/validators'),
    multer = require('../middleware/multer'),
    setLocals = require('../middleware/set-locals'),
    csurf = require('csurf'),
    csurfProtection = csurf({cookie:false});



router.post('/admin/new-product', validators.product, multer.single('image'), csurfProtection, setLocals, isAuth, adminCtrl.addProduct);
router.get('/admin/new-product', csurfProtection, setLocals, isAuth, adminCtrl.getAddProduct);
router.get('/admin/edit-product/:prodID',csurfProtection, setLocals, isAuth, adminCtrl.getEditProduct);
router.post('/admin/edit-product/', validators.editProduct, csurfProtection, setLocals, isAuth, adminCtrl.postEditProduct);
router.post('/admin/delete-product/', csurfProtection, setLocals, isAuth, adminCtrl.deleteProduct);
router.get('/admin/products-list', csurfProtection, setLocals, isAuth, adminCtrl.getProductList);

module.exports = router;