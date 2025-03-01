require('dotenv').config(); // Carrega as variáveis de ambiente
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Habilita o CORS

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'neondb_owner',
    host: 'ep-small-bar-a8bydmrx-pooler.eastus2.azure.neon.tech',
    database: 'neondb',
    password: 'npg_Y3ZNL6fxehGI',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Permite a conexão mesmo sem verificar o certificado
    },
});

// Rota de exemplo
app.get('/api/dados', async (req, res) => {
    try {
        const { tabela } = req.query; // Recebe o nome da tabela da query string
        const { rows } = await pool.query(`SELECT * FROM ${tabela}`); // Faz a consulta
        res.json(rows);  // Retorna os dados em formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});


// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro global:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});