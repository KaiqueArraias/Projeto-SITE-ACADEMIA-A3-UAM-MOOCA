const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Logs para depuração
console.log('Cliente Controller:', clienteController);
console.log('Auth Controller:', authController);
console.log('Auth Middleware:', authMiddleware);

// Rota de login
router.post('/login', authController.login);

//Rota Criar Cliente

router.post('/', clienteController.createCliente);

// Rota protegida para buscar informações do cliente
router.get('/info/:id', authMiddleware, clienteController.getClienteById);

// Buscar todos os clientes
router.get('/', clienteController.getClientes);

// Atualizar cliente
router.put('/:id', authMiddleware, clienteController.updateCliente);

// Excluir cliente
router.delete('/:id', authMiddleware, clienteController.deleteCliente);

// Atualizar endereço
router.put('/endereco/:id', authMiddleware, clienteController.updateEndereco);

// Atualizar assinatura
router.put('/cliente/assinatura/:id', authMiddleware, clienteController.updateAssinatura);

module.exports = router;
