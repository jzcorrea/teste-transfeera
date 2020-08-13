'use strict';

const express = require('express');

const app = express();

app.use(express.json());
app.use(require('./src/common/routes'));

module.exports = app;