const { check, body, validationResult } = require('express-validator/check'),
    User = require('../models/user'),
    Product = require('../models/product')

exports.signup = [
    // Express Validation
    [
        body('email', 'Please enter a valid E-mail')
        .isEmail()
        .custom((value, {
            req
        }) => {
            return User.findOne({
                    email: req.body.email
                })
                .then(user => {
                    if (user) {
                        return Promise.reject('Email already in use.');
                    }
                })
        })
        .normalizeEmail(),

        body('password', 'Please enter a valid Password')
        .isLength({
            min: 8,
            max: 18
        })
        .withMessage('The password must have at least 8 and at most 18 characters')
        .trim(),

        body('confirmpassword')
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('The passwords must match!')
            }
            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('auth/signup', {
                    path: '/signup',
                    pageTitle: 'Sign Up',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }

]

exports.resetPassword = [
    // Express Validation
    [
        body('newpassword', 'Please enter a valid Password')
        .isLength({
            min: 8,
            max: 18
        })
        .withMessage('The password must have at least 8 and at most 18 characters')
        .trim(),

        body('confirmnewpassword')
        .custom((value, { req }) => {
            if (value !== req.body.newpassword) {
                throw new Error('The passwords must match!')
            }
            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('auth/newpassword', {
                    path: 'auth/new-password',
                    pageTitle: 'New Password',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    },
                    user: req.body.user
                })
        } else {
            next();
        }
    }

]

exports.login = [
    [
        body('email', 'Please enter a valid E-mail')
        .isEmail()
        .normalizeEmail(),

        body('password', 'Please enter a valid Password')
        .isLength({
            min: 8,
            max: 18
        })
        .withMessage('The password must have at least 8 and at most 18 characters')
        .trim(),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('auth/login', {
                    path: '/login',
                    pageTitle: 'Sign Up',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }

]


exports.product = [
    [body('title', 'The Title must have between 10 and 60 characters.')
        .isLength({
            max: 60,
            min: 10
        }),

        body('description', 'The description must have beetwen 20 and 400 characters')
        .isLength({
            max: 400,
            min: 20
        }),

        body('price', 'The price must be a number!')
        .isNumeric()
        .trim()
        .toFloat(),

        body('img', 'The image is invalid, please enter a valid image!')
        .custom( (value, { req } ) => {
            if( !req.file ){
                throw new Error('The image is invalid, please enter a jpg, jpeg or png image type!')
            }

            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/new-product', {
                    path: 'admin/new-product',
                    pageTitle: 'New Product',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }
]


exports.editProduct = [
    [body('title', 'The Title must have between 20 and 60 characters.')
        .isLength({
            max: 60,
            min: 10
        }),

        body('price', 'The price must be a number!')
        .isNumeric()
        .trim()
        .toFloat(),

        body('description', 'The description must have beetwen 10 and 400 characters')
        .isLength({
            max: 400,
            min: 20
        })
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/edit-product', {
                    path: 'admin/edit-product',
                    pageTitle: 'Edit Product',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map( i => i.param)
                    },
                    prod: { ...req.body }
                })
        } else {
            next();
        }
    }
]