const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clienteController');

// Rota para criar cliente
router.post('/', clientesController.createCliente);

// Rota para listar todos os clientes
router.get('/', clientesController.getClientes);

// Rota para buscar cliente por ID
router.get('/:id', clientesController.getClienteById);

// Rota para atualizar cliente
router.put('/:id', clientesController.updateCliente);

// Rota para deletar cliente
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;


