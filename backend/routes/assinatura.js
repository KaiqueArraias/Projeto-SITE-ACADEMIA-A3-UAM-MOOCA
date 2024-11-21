const express = require('express');
const router = express.Router();
const assinaturaController = require('../controllers/assinaturaController');

// Criar uma nova assinatura
router.post('/', assinaturaController.createAssinatura);

// Listar todas as assinaturas
router.get('/', assinaturaController.getAssinaturas);

// Buscar uma assinatura por ID
router.get('/:id', assinaturaController.getAssinaturaById);

// Atualizar uma assinatura
router.put('/:id', assinaturaController.updateAssinatura);

// Excluir uma assinatura
router.delete('/:id', assinaturaController.deleteAssinatura);

module.exports = router;
