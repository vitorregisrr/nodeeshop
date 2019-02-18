const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    mongoDBSession = require('connect-mongodb-session')(session);
    path = require('path'),
    express = require('express'),
    app = express(),
    flash = require('connect-flash'),
    MONGO_URI = 'mongodb+srv://vitorregisr:12345@nodeshop-wmkec.mongodb.net/shop',
    setLocals = require('./app/middleware/set-locals'),
    csurfProtection = require('csurf')({cookie: true}),
    multer = require('./app/middleware/multer');

//seting views engine
app.set('view engine', 'ejs');
app.set('views', 'app/views');

//setting mongodb session 
const storeSession = new mongoDBSession({
    uri: MONGO_URI,
    collect: 'sessions'
});

//setting db models
const User = require('./app/models/user');

//seting app middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(expressSession({
    secret: 'A vida é muito coolzástica',
    resave: false,
    saveUninitialized: false,
    store: storeSession,
    cookie: {
        maxAge: 60 * 60 * 24 * 30 * 1000
    }
}));
app.use(flash());
app.use(multer.single('image'));
app.use(csurfProtection);

//checkng auth
app.use((req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => errorRoutes.get500(err, req, res, next));
    } else {
        req.user = null;
        next();
    }
});

app.use(setLocals);

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