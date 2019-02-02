const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', 'app/views');

//seting mongoDB
const mongoConnect = require('./app/util/db').mongoConnect;
const User = require('./app/models/user');

//seting body parser
app.use(bodyParser.urlencoded({extended: false}));

//routing files
const adminRoutes = require('./app/routes/admin');
const shopRoutes = require('./app/routes/shop');
const errorRoutes = require('./app/controllers/error');

//loggin the user with de cache
app.use((req, res, next) => {
    User.getById('5c539887d2735d4470659959')
    .then( user => {
        req.user = user;
        next();
    })
    .catch( err => {
        console.log(err);
    });
});

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes.get404);

//starting server
mongoConnect( () => {
    app.listen(3000);
});