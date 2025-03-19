const express = require('express');
const cors = require('cors');  
const { Pool } = require('pg');
const app = express();

// Para conseguir usar o navegador com diferentes dominios 
app.use(cors());  

// Configuração do banco de dados
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

// JSON para fazer a API pelo postmam
app.use(express.json());

// Rota para receber os dados do front-end
app.post('/usuarios', async (req, res) => {
    const { nome, email, celular, senha } = req.body;

    try {
        const query = `
        INSERT INTO sga.usuario (nome, email, celular, senha, data_criacao)
        VALUES ($1, $2, $3, $4, NOW())
    `;
        const result = await pool.query(query, [nome, email || null, celular, senha || null]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', result });
    } catch (err) {
        console.error('Erro ao inserir usuário:', err);
        res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err });
    }
});

// Inicializa o servidor - 'node alteracao_cadastro.js'
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
