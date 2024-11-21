const express = require('express');
const router = express.Router();
const planosController = require('../controllers/planosController');

// Rota para criar um novo plano
router.post('/', planosController.createPlano);

// Rota para listar todos os planos
router.get('/', planosController.getPlanos);

// Rota para buscar um plano por ID
router.get('/:id', planosController.getPlanoById);

// Rota para atualizar um plano
router.put('/:id', planosController.updatePlano);

// Rota para excluir um plano
router.delete('/:id', planosController.deletePlano);

module.exports = router;
