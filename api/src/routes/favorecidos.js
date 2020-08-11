const { Router } = require('express');
const router = Router();
const FavorecidosController = require('../controllers/FavorecidosController');
const validations = require('../validations/favorecidos');

router.get('/', validations.getAll, FavorecidosController.getAll);

router.post('/', FavorecidosController.upsert);

router.put('/:id', FavorecidosController.upsert);

router.delete('/one/:id', FavorecidosController.deleteOne);

router.delete('/many', FavorecidosController.deleteMany);

module.exports = router;