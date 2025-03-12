const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conectando diretamento com o URL do banco 
const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_Y3ZNL6fxehGI@ep-small-bar-a8bydmrx-pooler.eastus2.azure.neon.tech:5432/neondb?sslmode=require',
});

// Rota para salvar os dados
app.post('/api/usuario', async (req, res) => {
  const { nome, email, celular, senha } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO usuario (nome, senha, email, celular) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, senha, email, celular]
    );

    res.json(result.rows[0]); // Retorna o dado salvo para o front-end
  } catch (error) {
    console.error('Erro ao salvar alteração:', error);
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor no terminal com o node + nome do arquivo
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
