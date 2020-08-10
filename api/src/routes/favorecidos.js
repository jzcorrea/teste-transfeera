const { Router } = require('express');
const router = Router();
const FavorecidosController = require('../controllers/FavorecidosController');
const validations = require('../validations/favorecidos');

router.get('/', validations.getAll, FavorecidosController.getAll);

router.post('/', FavorecidosController.upsert);

module.exports = router;