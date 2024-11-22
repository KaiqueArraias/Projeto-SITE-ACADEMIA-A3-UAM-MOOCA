const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Verificar se o controlador está carregado
console.log('Controlador carregado:', clienteController);

// Criar cliente
router.post('/', clienteController.createCliente);

// Buscar todos os clientes
router.get('/', clienteController.getClientes); // Adicionando a rota para buscar todos os clientes

// Buscar cliente por ID
router.get('/:id', clienteController.getClienteById);

// Atualizar cliente
router.put('/:id', clienteController.updateCliente);

// Excluir cliente
router.delete('/:id', clienteController.deleteCliente);

// Atualizar endereço
router.put('/endereco/:id', clienteController.updateEndereco);

// Atualizar assinatura
router.put('/assinatura/:id', clienteController.updateAssinatura);

module.exports = router;
