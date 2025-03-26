const express = require('express');
const cors = require('cors');  
const { Pool } = require('pg');
const app = express();

// Para conseguir usar o navegador com diferentes dominios 
app.use(cors());  

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'neondb_owner',
    host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech',
    database: 'neondb',
    password: 'npg_Y3ZNL6fxehGI',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Permite a conexão mesmo sem verificar o certificado
    },
});

// JSON para fazer a API pelo postmam
app.use(express.json());

// Rota para receber os dados do front-end
app.post('/usuarios', async (req, res) => {
    const { nome, email, celular, senha } = req.body;
    
    console.log('Dados recebidos:', { nome, email, celular, senha });

    try {
        const query = `
        INSERT INTO sga.usuario (nome, email, celular, senha, data_criacao)
        VALUES ($1, $2, $3, $4, NOW())
    `;
        const result = await pool.query(query, [nome, email, celular, senha]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', result });
    } catch (err) {
        console.error('Erro ao inserir usuário:', err);
        res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        console.log(" Buscando todos os usuários...");
        const result = await pool.query('SELECT * FROM sga.usuario'); // Busca todos os usuários
        
        console.log("Dados encontrados:", result.rows);
        res.status(200).json(result.rows); // Retorna os dados encontrados
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
});

// Inicializa o servidor - 'node alteracao_cadastro.js'
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Teste de conexão e consulta dos dados da tabela
async function testConnection() {
    try {
        const client = await pool.connect();  // Conecta ao banco
        console.log('Conexão com o banco de dados estabelecida com sucesso!');

        const result = await client.query('SELECT * FROM sga.usuario');
        console.log('Dados da tabela usuario:', result.rows);

        client.release();  // Libera a conexão após o teste
    } catch (err) {
        console.error('Erro ao conectar ou consultar o banco de dados:', err);
    }
}

testConnection()