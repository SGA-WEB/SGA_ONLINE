require('dotenv').config(); // Carrega as variáveis de ambiente
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do PostgreSQL
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Rota de exemplo
app.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM sga.produtos');
        res.json(rows);
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