
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sga_online',
    password: '1213',
    port: 5432,
});

// Rota para buscar dados da tabela
app.get('/api/dados', async (req, res) => {
    console.log(res)
    try {
        const { rows } = await pool.query('SELECT * FROM sga.centro_estoque');
        res.json({ success: true, data: rows }); // Retorna um objeto JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro no servidor' }); // Retorna um objeto JSON em caso de erro
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});