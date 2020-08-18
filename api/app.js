'use strict';

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    app.use(cors());

    next();
});

app.use(require('./src/common/routes'));

module.exports = app;