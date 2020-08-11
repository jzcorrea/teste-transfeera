const { Router } = require('express');
const router = Router();
const validation = require('./favorecidos.validation');
const FavorecidosController = require('./favorecidos.controller');

router.get('/', validation.getAll.query, FavorecidosController.getAll);

router.get('/:id', validation.getOne.params, FavorecidosController.getOne);

router.post('/', validation.create.body, FavorecidosController.upsert);

router.put('/:id', validation.update.params, validation.update.body, FavorecidosController.upsert);

router.delete('/one/:id', validation.delete.params, FavorecidosController.deleteOne);

router.delete('/many', validation.deleteMany.body, FavorecidosController.deleteMany);

module.exports = router;