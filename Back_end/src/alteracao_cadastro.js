const express = require('express');
const cors = require('cors');  
const { Pool } = require('pg');
const app = express();

app.use(cors());  
app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'neondb_owner',
    host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech',
    database: 'neondb',
    password: 'npg_Y3ZNL6fxehGI',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
        
    },
});

// Rota para cadastrar usuário (POST)
app.post('/usuarios', async (req, res) => {
    const { nome, email, celular, senha } = req.body;
    
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

// Rota para listar usuários (GET)
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sga.usuario');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


