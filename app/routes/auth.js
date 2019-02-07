const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');

router.post('/login', authCtrl.postLogin);
router.get('/login', authCtrl.getLogin);
router.post('/logout', authCtrl.postLogout);
router.get('/signup', authCtrl.getSignup);
router.post('/signup', authCtrl.postSignup);

module.exports = router;