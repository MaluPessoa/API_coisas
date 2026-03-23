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
// PARÂMETRO: dados (objeto) - contém nomec, tipoc, valor, dtcoisa
// RETORNO: Promise que resolve com o coisa criado (com ID)
// ============================================================
function criar(dados) {
  return new Promise((resolve, reject) => {
    // Desestruturar os dados
    const { nomec, tipoc, valor, dtcoisa, qntc } = dados;
    
    // SQL: INSERT adiciona novo registro
    // IMPORTANTE: NÃO incluímos o ID aqui porque ele é AUTOINCREMENT
    // O SQLite gera o ID automaticamente!
    const sql = `
      INSERT INTO coisa (nomec, tipoc, valor, dtcoisa, qntc)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    // db.run() executa comandos INSERT/UPDATE/DELETE
    // IMPORTANTE: usar 'function' tradicional (não arrow function)
    // para ter acesso ao 'this.lastID'
    db.run(sql, [nomec, tipoc, valor, dtcoisa, qntc], function(erro) {
      if (erro) {
        reject(erro);
      } else {
        // this.lastID contém o ID que o banco gerou automaticamente
        // para o registro que acabamos de inserir
        resolve({
          id: this.lastID,
          nomec,
          tipoc,
          valor,
          dtcoisa,
          qntc
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
// ❌ NÃO fazemos: INSERT INTO coisas (id, nomec, ...) VALUES (?, ?, ...)
// ✅ Fazemos: INSERT INTO coisas (nomec, tipoc, ...) VALUES (?, ?, ...)
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
    const { nomec, tipoc, valor, dtcoisa, qntc } = dados;
    
    // SQL: UPDATE modifica um registro existente
    const sql = `
      UPDATE coisa
      SET nomec = ?, tipoc = ?, valor = ?, dtcoisa = ? qntc = ?
      WHERE id = ?
    `;
    
    // Passar os parâmetros na ordem dos placeholders
    db.run(sql, [nomec, tipoc, valor, dtcoisa, qntc, id], function(erro) {
      if (erro) {
        reject(erro);
      } else if (this.changes === 0) {
        // this.changes = quantidade de linhas afetadas
        // Se for 0, o coisa não foi encontrado
        resolve(null);
      } else {
        // coisa atualizado com sucesso
        resolve({ id, nomec, tipoc, valor, dtcoisa, qntc });
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
// FUNÇÃO: buscarPordtcoisa
// DESCRIÇÃO: Filtra coisas por dtcoisa
// PARÂMETRO: dtcoisa (string)
// RETORNO: Promise com array de coisas
// ============================================================
function buscarPordtcoisa(dtcoisa) {
  return new Promise((resolve, reject) => {
    // LIKE permite busca com padrão
    // O % significa "qualquer texto antes/depois"
    const sql = 'SELECT * FROM coisas WHERE dtcoisa LIKE ?';
    
    db.all(sql, [`%${dtcoisa}%`], (erro, linhas) => {
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
  buscarPordtcoisa
};
