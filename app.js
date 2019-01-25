const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'app/views');

//seting body parser
app.use(bodyParser.urlencoded({extended: false}));

//routing files
const adminRoutes = require('./app/routes/admin');
const shopRoutes = require('./app/routes/shop');
const errorRoutes = require('./app/controllers/error');

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes.get404);

//starting server
app.listen(3000);