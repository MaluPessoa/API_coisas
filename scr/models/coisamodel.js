// Importar a conexão com o banco de dados
const db = require('../config/database');

// ============================================================
// FUNÇÃO: listarTodos
// DESCRIÇÃO: Retorna todos os coisas do banco
// RETORNO: Promise que resolve com array de coisas
// ============================================================
function listarTodos() {
  // Retornamos uma Promise porque a operação é assíncrona
  return new Promise((resolve, reject) => {
    // SQL: SELECT busca todos os registros
    const sql = 'SELECT * FROM coisa';
    
    // db.all() busca múltiplas linhas
    // [] são os parâmetros (vazio neste caso)
    db.all(sql, [], (erro, linhas) => {
      if (erro) {
        reject(erro);    // Se der erro, rejeita a Promise
      } else {
        resolve(linhas); // Se sucesso, resolve com os dados
      }
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorId
// DESCRIÇÃO: Busca um coisa específico pelo ID
// PARÂMETRO: id (número) - identificador do coisa
// RETORNO: Promise que resolve com o coisa ou undefined
// ============================================================
function buscarPorId(id) {
  return new Promise((resolve, reject) => {
    // O '?' é um placeholder seguro
    // Isso previne SQL Injection!
    const sql = 'SELECT * FROM coisa WHERE id = ?';
    
    // db.get() busca uma única linha
    db.get(sql, [id], (erro, linha) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linha);  // undefined se não encontrar
      }
    });
  });
}

// ============================================================
// FUNÇÃO: criar
// DESCRIÇÃO: Insere um novo coisa no banco
// PARÂMETRO: dados (objeto) - contém nome, preco, estoque, categoria
// RETORNO: Promise que resolve com o coisa criado (com ID)
// ============================================================
function criar(dados) {
  return new Promise((resolve, reject) => {
    // Desestruturar os dados
    const { nome, preco, estoque, categoria } = dados;
    
    // SQL: INSERT adiciona novo registro
    // IMPORTANTE: NÃO incluímos o ID aqui porque ele é AUTOINCREMENT
    // O SQLite gera o ID automaticamente!
    const sql = `
      INSERT INTO coisa (nome, preco, estoque, categoria)
      VALUES (?, ?, ?, ?)
    `;
    
    // db.run() executa comandos INSERT/UPDATE/DELETE
    // IMPORTANTE: usar 'function' tradicional (não arrow function)
    // para ter acesso ao 'this.lastID'
    db.run(sql, [nome, preco, estoque, categoria], function(erro) {
      if (erro) {
        reject(erro);
      } else {
        // this.lastID contém o ID que o banco gerou automaticamente
        // para o registro que acabamos de inserir
        resolve({
          id: this.lastID,
          nome,
          preco,
          estoque,
          categoria
        });
      }
    });
  });
}

// ⚠️ NOTA IMPORTANTE SOBRE AUTOINCREMENT:
// Quando criamos a tabela, definimos o campo ID como AUTOINCREMENT.
// Isso significa que o BANCO DE DADOS é responsável por gerar o próximo ID.
// 
// Por isso:
// ❌ NÃO fazemos: INSERT INTO coisas (id, nome, ...) VALUES (?, ?, ...)
// ✅ Fazemos: INSERT INTO coisas (nome, preco, ...) VALUES (?, ?, ...)
//
// O SQLite adiciona o ID automaticamente e podemos recuperá-lo usando this.lastID

// ============================================================
// FUNÇÃO: atualizar
// DESCRIÇÃO: Atualiza todos os dados de um coisa
// PARÂMETROS:
//   - id (número): identificador do coisa
//   - dados (objeto): novos dados
// RETORNO: Promise com coisa atualizado ou null
// ============================================================
function atualizar(id, dados) {
  return new Promise((resolve, reject) => {
    const { nome, preco, estoque, categoria } = dados;
    
    // SQL: UPDATE modifica um registro existente
    const sql = `
      UPDATE coisa
      SET nome = ?, preco = ?, estoque = ?, categoria = ?
      WHERE id = ?
    `;
    
    // Passar os parâmetros na ordem dos placeholders
    db.run(sql, [nome, preco, estoque, categoria, id], function(erro) {
      if (erro) {
        reject(erro);
      } else if (this.changes === 0) {
        // this.changes = quantidade de linhas afetadas
        // Se for 0, o coisa não foi encontrado
        resolve(null);
      } else {
        // coisa atualizado com sucesso
        resolve({ id, nome, preco, estoque, categoria });
      }
    });
  });
}

// ============================================================
// FUNÇÃO: deletar
// DESCRIÇÃO: Remove um coisa do banco
// PARÂMETRO: id (número) - identificador do coisa
// RETORNO: Promise com true (sucesso) ou false (não encontrado)
// ============================================================
function deletar(id) {
  return new Promise((resolve, reject) => {
    // SQL: DELETE remove um registro
    const sql = 'DELETE FROM coisa WHERE id = ?';
    
    db.run(sql, [id], function(erro) {
      if (erro) {
        reject(erro);
      } else {
        // Retorna true se deletou alguma linha
        resolve(this.changes > 0);
      }
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorCategoria
// DESCRIÇÃO: Filtra coisas por categoria
// PARÂMETRO: categoria (string)
// RETORNO: Promise com array de coisas
// ============================================================
function buscarPorCategoria(categoria) {
  return new Promise((resolve, reject) => {
    // LIKE permite busca com padrão
    // O % significa "qualquer texto antes/depois"
    const sql = 'SELECT * FROM coisas WHERE categoria LIKE ?';
    
    db.all(sql, [`%${categoria}%`], (erro, linhas) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linhas);
      }
    });
  });
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
