const User = require('../models/user'),
    bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) =>{
    res.render('shop/login', {
        pageTitle: 'Login',
        path: '/login',
        isLogged: req.user ? { name: req.user.name } : false
    })
}
exports.postLogin = (req, res, next) => {
    const form = {
        ...req.body
    };
    
    User.findOne({
            name: form.username
        })
        .then(user => {
            if (!user) {
                return res.redirect('/signup');
            }

            return bcrypt.compare(form.password, user.password)
                .then(success => {
                    if (success) {
                        req.session.user = user;
                        return res.redirect('/');
                    }

                    return res.redirect('/login')
                })
                .catch(err => res.redirect('/login'))
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('shop/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        isLogged: req.user
    })
}

exports.postSignup = (req, res, next) => {
    const form = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.findOne({
            email: form.email
        })
        .then(user => {
            if (user) {
                return res.redirect('/');
            }

            return bcrypt
                .hash(form.password, 12)
                .then(hashedPass => {
                    return new User({
                            ...form,
                            password: hashedPass
                        })
                        .save()
                })
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
}