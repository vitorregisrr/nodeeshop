const express = require('express'),
router = express.Router(),
authCtrl = require('../controllers/auth'),
validators = require('../middleware/validators');

router.post('/login', validators.login, authCtrl.postLogin);
router.get('/login', authCtrl.getLogin);

router.post('/logout', authCtrl.postLogout);

router.get('/signup', authCtrl.getSignup);
router.post('/signup', validators.signup, authCtrl.postSignup);

router.get('/resetpassword', authCtrl.getResetPassword);
router.post('/resetpassword', authCtrl.postResetPassword);

router.get('/newpassword/:passwordToken', authCtrl.getNewPassword);
router.post('/newpassword', validators.resetPassword, authCtrl.postNewPassword);

module.exports = router;