const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session);
    path = require('path'),
    express = require('express'),
    app = express(),
    csurf = require('csurf'),
    flash = require('connect-flash'),
    multer = require('multer'),
    MONGO_URI = 'mongodb+srv://vitorregis:santovitor123@nodeshop-wmkec.mongodb.net/shop';

app.set('view engine', 'ejs');
app.set('views', 'app/views');

//protecting from csurf ataccks
const csrfProtection = csurf();

//setting mongodb session 
const storeSession = new MongoDBStore({
    uri: MONGO_URI,
    collect: 'sessions'
});

//seting db models
const User = require('./app/models/user');

//seting app middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(multer({dest: 'images'}).single('image'));
app.use(cookieParser());
app.use(expressSession({
    secret: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit recusandae maxime neque, aperiam laborum eum sequi at ducimus eius beatae ipsam iure delectus maiores illo quaerat numquam rerum quae nulla. ',
    resave: false,
    saveUninitialized: false,
    store: storeSession
}));
app.use(csrfProtection);
app.use(flash());


//checkng auth
app.use((req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => errorRoutes.get500(err, req, res, next) );
    } else {
        req.user = null;
        next();
    }
});

// setting data for all views
app.use( (req, res, next) => {
    res.locals.isLogged = req.user ? {name: req.user.name}  : null;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//routing files
const adminRoutes = require('./app/routes/admin');
const shopRoutes = require('./app/routes/shop');
const authRoutes = require('./app/routes/auth');
const errorRoutes = require('./app/controllers/error');

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorRoutes.get404);
app.use(errorRoutes.get500);

//starting server
mongoose.connect(MONGO_URI, {
        useNewUrlParser: true
    })
    .then((resul) => {})
    .then(resul => {
        app.listen(3000);
    })
    .catch(err => console.log(err));