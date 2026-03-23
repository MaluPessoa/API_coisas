// Importar as funções do Model
const coisaModel = require('../models/coisamodel');

// ============================================================
// FUNÇÃO: listarTodos (ASSÍNCRONA)
// ROTA: GET /coisas
// DESCRIÇÃO: Lista todos os coisas do banco de dados
// ============================================================
// A palavra 'async' antes da função permite usar 'await' dentro dela
async function listarTodos(req, res) {
  try {
    // 'await' pausa a execução até a Promise do Model resolver
    // É como "esperar" o banco de dados responder
    const coisas = await coisaModel.listarTodos();
    
    // Depois que os dados chegam, enviar a resposta
    res.status(200).json(coisas);
  } catch (erro) {
    // Se der qualquer erro, cai aqui
    res.status(500).json({ 
      mensagem: 'Erro ao listar coisas', 
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorId (ASSÍNCRONA)
// ROTA: GET /coisas/:id
// ============================================================
async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    // Validar o ID antes de consultar o banco
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    // Aguardar a busca no banco
    const coisa = await coisaModel.buscarPorId(id);
    
    if (coisa) {
      res.status(200).json(coisa);
    } else {
      res.status(404).json({ 
        mensagem: `coisa ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar coisa',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: criar (ASSÍNCRONA)
// ROTA: POST /coisas
// ============================================================
async function criar(req, res) {
  try {
    const { nome, preco, estoque, categoria } = req.body;
    
    // Validações ANTES de tentar inserir no banco
    if (!nome || !preco || !estoque || !categoria) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    if (parseFloat(preco) <= 0) {
      return res.status(400).json({ 
        mensagem: 'O preço deve ser maior que zero' 
      });
    }
    
    if (parseInt(estoque) < 0) {
      return res.status(400).json({ 
        mensagem: 'O estoque não pode ser negativo' 
      });
    }
    
    // Aguardar a inserção no banco
    const novocoisa = await coisaModel.criar({ 
      nome, 
      preco, 
      estoque, 
      categoria 
    });
    
    // Retornar o coisa criado com status 201
    res.status(201).json(novocoisa);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao criar coisa',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: atualizar (ASSÍNCRONA)
// ROTA: PUT /coisas/:id
// ============================================================
async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { nome, preco, estoque, categoria } = req.body;
    
    // Validações
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    if (!nome || !preco || !estoque || !categoria) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    // Aguardar a atualização no banco
    const coisaAtualizado = await coisaModel.atualizar(id, { 
      nome, 
      preco, 
      estoque, 
      categoria 
    });
    
    if (coisaAtualizado) {
      res.status(200).json(coisaAtualizado);
    } else {
      res.status(404).json({ 
        mensagem: `coisa ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao atualizar coisa',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: deletar (ASSÍNCRONA)
// ROTA: DELETE /coisas/:id
// ============================================================
async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    // Aguardar a deleção no banco
    const deletado = await coisaModel.deletar(id);
    
    if (deletado) {
      res.status(200).json({ 
        mensagem: `coisa ${id} removido com sucesso` 
      });
    } else {
      res.status(404).json({ 
        mensagem: `coisa ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao deletar coisa',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorCategoria (ASSÍNCRONA)
// ROTA: GET /coisas/categoria/:categoria
// ============================================================
async function buscarPorCategoria(req, res) {
  try {
    const { categoria } = req.params;
    
    // Aguardar a busca no banco
    const coisas = await coisaModel.buscarPorCategoria(categoria);
    
    res.status(200).json(coisas);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar coisas por categoria',
      erro: erro.message 
    });
  }
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// ============================================================
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorCategoria
};
