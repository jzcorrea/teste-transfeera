const { Router } = require('express');
const router = Router();
const favorecidosController = require('../controllers/FavorecidosController');

router.get('/', favorecidosController.getAll);

module.exports = router;