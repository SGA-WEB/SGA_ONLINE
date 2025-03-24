const { Client } = require('pg');

// Configurações de conexão com o banco de dados
const client = new Client({
  user: 'neondb_owner',
  host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech',
  database: 'neondb',
  password: 'npg_Y3ZNL6fxehGI',
  port: 5432,
  ssl: {
      rejectUnauthorized: false, // Permite a conexão mesmo sem verificar o certificado
  },
});

// Dados que você deseja inserir
const dados = {
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    celular: '11987654321',
    senha: 'senha123',
    data_criacao: new Date() // Adiciona a data atual
};

// Função para inserir dados
async function insertData() {
    try {
        await client.connect(); // Conecta ao banco de dados

        // Query SQL para inserir dados
        const query = `
            INSERT INTO sga.usuario (nome, email, celular, senha, data_criacao)
            VALUES ($1, $2, $3, $4, $5)
        `;

        // Executa a query
        const res = await client.query(query, [
            dados.nome,
            dados.email,
            dados.celular,
            dados.senha,
            dados.data_criacao
        ]);

        console.log('Dados inseridos com sucesso:', );
    } catch (err) {
        console.error('Erro ao inserir dados:', err);
    } finally {
        await client.end(); // Fecha a conexão com o banco de dados
    }
}

async function getData() {
  try {
      await client.connect(); // Conecta ao banco de dados

      // Query SQL para buscar dados
      const query = 'SELECT * FROM sga.usuario';
      const res = await client.query(query);

      console.log('Dados encontrados:');
      console.log(res.rows); // Exibe os dados no console
  } catch (err) {
      console.error('Erro ao buscar dados:', err);
  } finally {
      await client.end(); // Fecha a conexão com o banco de dados
  }
}

// Escolha qual função executar
const operation = process.argv[2]; // Recebe a operação como argumento na linha de comando

if (operation === 'insert') {
  insertData(); // Executa a função de inserção
} else if (operation === 'get') {
  getData(); // Executa a função de consulta
} else {
  console.log('Operação inválida. Use "insert" ou "get".');
}
