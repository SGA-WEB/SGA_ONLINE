const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const cors = require('cors');
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sga_online',
    password: '1234',
    port: 5432,
});

app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM sga.usuario WHERE email = $1 AND senha = $2',
            [email, senha]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Login bem-sucedido' });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
