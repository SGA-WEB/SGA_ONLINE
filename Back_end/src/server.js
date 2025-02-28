require('dotenv').config(); // Carrega as variáveis de ambiente
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
    origin: 'https://sga-web.github.io', // URL do seu front-end no GitHub Pages
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite o envio de credenciais (cookies, tokens)
}));

// Configuração do PostgreSQL (usando variáveis de ambiente)
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
    ssl: {
        rejectUnauthorized: false, // Permite a conexão mesmo sem verificar o certificado
    },
});

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Rota para buscar dados de uma tabela
app.get('/api/dados', async (req, res) => {
    const { tabela } = req.query;

    // Validação do nome da tabela
    if (!tabela || !/^[a-zA-Z_]+$/.test(tabela)) {
        return res.status(400).json({ error: 'Nome da tabela inválido' });
    }

    try {
        const { rows } = await pool.query(`SELECT * FROM ${tabela}`); // Faz a consulta
        res.json(rows);  // Retorna os dados em formato JSON
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ error: 'Erro no servidor', details: err.message });
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