const express = require('express');
const router = express.Router();
const assinaturaController = require('../controllers/assinaturaController');

// Rotas para assinatura
router.post('/', assinaturaController.createAssinatura); // Criar uma nova assinatura
router.get('/', assinaturaController.getAssinaturas); // Listar todas as assinaturas
router.get('/:id', assinaturaController.getAssinaturaById); // Buscar assinatura por ID
router.put('/:id', assinaturaController.updateAssinatura); // Atualizar assinatura
router.delete('/:id', assinaturaController.deleteAssinatura); // Excluir assinatura

module.exports = router;
