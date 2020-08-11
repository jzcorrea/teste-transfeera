'use strict';

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('./src/services/router.service'));

app.listen(port, () => {

    console.log(`Server running at port ${port}`);
});