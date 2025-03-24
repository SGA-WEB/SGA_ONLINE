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
