const { Router } = require('express');
const router = Router();

router.use('/favorecidos', require('../modules/favorecidos/favorecidos.routes'));

module.exports = router;