const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do arquivo do banco de dados
// __dirname = diretório atual do arquivo
const dbPath = path.resolve(__dirname, '../config/coisa.db');

// Criar/abrir a conexão com o banco
const db = new sqlite3.Database(dbPath, (erro) => {
  if (erro) {
    console.error('❌ Erro ao conectar:', erro);
  } else {
    console.log('✅ Conectado ao SQLite!');
  }
});



// IMPORTANTE: Exportar o objeto 'db' diretamente
// NÃO exportar dentro de um objeto { db }
module.exports = db;

