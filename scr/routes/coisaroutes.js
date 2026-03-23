// Importar o Express para criar o router
const express = require('express');
const router = express.Router();

// Importar as funções do Controller
const coisaController = require('../controllers/coisacontroller');

// ============================================================
// DEFINIÇÃO DAS ROTAS
// Cada rota chama uma função específica do Controller
// ============================================================

// IMPORTANTE: rotas mais específicas devem vir ANTES das genéricas!
// '/dtcoisa/:cat' deve vir antes de '/:id'

// GET /coisas - Listar todos os coisas
router.get('/', coisaController.listarTodos);

// GET /coisas/dtcoisa/:dtcoisa - Buscar por dtcoisa
router.get('/dtcoisa/:dtcoisa', coisaController.buscarPordtcoisa);

// GET /coisas/:id - Buscar coisa específico por ID
router.get('/:id', coisaController.buscarPorId);

// POST /coisas - Criar novo coisa
router.post('/', coisaController.criar);

// PUT /coisas/:id - Atualizar coisa completo
router.put('/:id', coisaController.atualizar);

// DELETE /coisas/:id - Deletar coisa
router.delete('/:id', coisaController.deletar);

// ============================================================
// EXPORTAR O ROUTER
// ============================================================
module.exports = router;


