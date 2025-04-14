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
    /* host: 'ep-small-bar-a8bydmrx-pooler.eastus2.azure.neon.tech', */
    host: 'ep-weathered-hill-a8qiljz1-pooler.eastus2.azure.neon.tech', // Brach: Matheus
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

app.get('/api/centro_estoque', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM sga.centro_estoque WHERE inativo = FALSE');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar centro_estoque' });
    }
});

app.get('/api/produto', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
            p.id_produto, 
            p.produto, 
            p.quantidade, 
            p.preco_varejo, 
            p.preco_atacado, 
            p.descricao,
            p.data_cadastro,
            ce.nome_centro_estoque,
            ce.id_centro_estoque AS fk_id_centro_estoque
            FROM sga.produto p
            LEFT JOIN sga.centro_estoque ce ON p.id_centro_estoque = ce.id_centro_estoque
            WHERE p.inativo = FALSE
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

app.get('/api/contato', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM sga.contato WHERE inativo = FALSE');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
});

// Endpoint para atualizar um centro de estoque (PUT)
app.put('/centro_estoque/:id_centro_estoque', async (req, res) => {
    const { id_centro_estoque } = req.params;
    const { nome, localizacao, padrao, descricao } = req.body;
    try {
        const query = `
            UPDATE sga.centro_estoque 
            SET 
                nome_centro_estoque = $1, 
                localizacao_centro_estoque = $2, 
                padrao_centro_estoque = $3, 
                descricao_centro_estoque = $4
            WHERE id_centro_estoque = $5
            RETURNING *;
        `;
        const values = [nome, localizacao, padrao, descricao, id_centro_estoque];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({
            message: 'Usuário atualizado com sucesso!',
            usuario: result.rows[0]
        });
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.put('/produto/:id_produto', async (req, res) => {
    const { id_produto } = req.params;
    const { produto, quantidade, preco_varejo, preco_atacado, descricao, id_centro_estoque} = req.body;
    try {
        const query = `
            UPDATE sga.produto 
            SET 
                produto = $1, 
                quantidade = $2, 
                preco_varejo = $3, 
                preco_atacado = $4,
                descricao = $5,
                id_centro_estoque = $6
            WHERE id_produto = $7
            RETURNING *;
        `;
        const values = [produto, quantidade, preco_varejo, preco_atacado, descricao, id_centro_estoque, id_produto];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json({
            message: 'Produto atualizado com sucesso!',
            produto: result.rows[0]
        });
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// app.put('/produto/:id_produto', async (req, res) => {
//     const { id_produto } = req.params;
//     const { produto, quantidade, preco_varejo, preco_atacado} = req.body;
//     try {
//         const query = `
//             UPDATE sga.produto 
//             SET 
//                 produto = $1, 
//                 quantidade = $2, 
//                 preco_varejo = $3, 
//                 preco_atacado = $4
//             WHERE id_produto = $5
//             RETURNING *;
//         `;
//         const values = [produto, quantidade, preco_varejo, preco_atacado, id_produto];
//         const result = await pool.query(query, values);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Produto não encontrado' });
//         }

//         res.status(200).json({
//             message: 'Produto atualizado com sucesso!',
//             produto: result.rows[0]
//         });
//     } catch (err) {
//         console.error('Erro ao atualizar produto:', err);
//         res.status(500).json({ error: 'Erro interno no servidor' });
//     }
// });

// Endpoint para inativar tabalas (DELETE)
app.delete('/centro_estoque/:id_centro_estoque', async (req, res) => {
    const { id_centro_estoque } = req.params;
    try {
        await pool.query(`
            UPDATE sga.centro_estoque 
            SET inativo = TRUE 
            WHERE id_centro_estoque = $1
        `, [id_centro_estoque]);
        res.status(200).json({ message: 'Centro de estoque excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir' });
    }
});

app.delete('/produto/:id_produto', async (req, res) => {
    const { id_produto } = req.params;
    try {
        await pool.query(`
            UPDATE sga.produto 
            SET inativo = TRUE 
            WHERE id_produto = $1
        `, [id_produto]);
        res.status(200).json({ message: 'Produto excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir' });
    }
});

app.delete('/contato/:id_contato', async (req, res) => {
    const { id_contato } = req.params;
    try {
        await pool.query(`
            UPDATE sga.contato 
            SET inativo = TRUE 
            WHERE id_contato = $1
        `, [id_contato]);
        res.status(200).json({ message: 'Centro de estoque excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
