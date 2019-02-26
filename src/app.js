'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: false
}));


//Conecta no Banco MongoDB:
mongoose.connect('mongodb://admin:admin123@ds054289.mlab.com:54289/testbooks', { useNewUrlParser: true });

// Carrega a Model:
const Book = require('./models/book');

//Carrega Rotas:
const indexRoute = require('./routes/index-route');
const bookRoute = require('./routes/book-route');


app.use('/', indexRoute);
app.use('/book', bookRoute);
app.use('/', router);

module.exports = app;