const { Router } = require('express');
const router = Router();

router.use('/favorecidos', require('./favorecidos'));

module.exports = router;