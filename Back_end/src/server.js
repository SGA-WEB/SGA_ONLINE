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
    // host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech',
    host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech',
    database: 'neondb',
    password: 'npg_Y3ZNL6fxehGI',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Permite a conexão mesmo sem verificar o certificado
    },
});

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

app.use(express.json()); // Permite que o servidor processe JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Permite processar dados de formulário

const path = require('path');
// Configura o servidor para servir arquivos estáticos da pasta "Front_end"
app.use(express.static(path.join(__dirname, 'Front_end')));


// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro global:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
});

//// 🔐 Rota para validar o login
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o e-mail existe no banco
        const userResult = await pool.query('SELECT * FROM sga.usuario WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'E-mail não encontrado' });
        }

        // Verifica se a senha está correta
        const senhaResult = await pool.query('SELECT * FROM sga.usuario WHERE email = $1 AND senha = $2', [email, senha]);

        if (senhaResult.rows.length === 0) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Se passou pelas verificações, login foi bem-sucedido
        res.json({ message: 'Login bem-sucedido' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});



app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
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


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


// Rota para ATUALIZAR usuário (PUT)
app.put('/usuarios/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { nome, email, celular, senha } = req.body;

    try {
        const query = `
            UPDATE sga.usuario
            SET nome = $1, email = $2, celular = $3, senha = $4
            WHERE id_usuario = $5
            RETURNING *;
        `;
        const values = [nome, email, celular, senha, id_usuario];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({ 
            message: 'Usuário atualizado com sucesso!',
            usuario: result.rows[0]
        });
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

