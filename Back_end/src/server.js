import express from 'express';
import session from 'express-session';
// import pkg from 'pg';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
// import { Pool } from 'pg/lib/index.js';
import pkg from 'pg';
const { Pool } = pkg;

const supabaseUrl = 'https://ertkiirzzswpxkgcxret.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydGtpaXJ6enN3cHhrZ2N4cmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEyMzMwNCwiZXhwIjoyMDYxNjk5MzA0fQ.sldy2ROLnO14WI-Iam1iqjCyfHA2wfWFNWcbwcI1snE';
const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const { Pool } = pkg;
const app = express();

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );
    next();
});

const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do Content Security Policy

app.use(cors({
    origin: 'http://127.0.0.1:5503', // ou 'http://localhost:5503'
    credentials: true
}));

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'neondb_owner',
    /* host: 'ep-small-bar-a8bydmrx-pooler.eastus2.azure.neon.tech', */
    host: 'ep-weathered-hill-a8qiljz1-pooler.eastus2.azure.neon.tech', // Brach: Matheus
    // host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech', // Branch: Renata
    database: 'neondb',
    password: 'npg_Y3ZNL6fxehGI',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Permite a conexão mesmo sem verificar o certificado
    },
});


app.use(express.json()); // Permite que o servidor processe JSON no corpo da requisição

app.use(session({
    secret: 'seuSuperSegredoUltraSeguro', // depois guarde em .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30, // 30 minutos
        sameSite: 'lax', // ou 'none' se for https
        secure: false    // true só se for https
    }
}));


//TESTE DE ROTA
app.get('/', (req, res) => {
    res.send('API SGA rodando!');
});

app.get('/', (req, res) => res.send('API rodando!'));

// Rota para retornar o usuário logado
app.get('/api/usuario', (req, res) => {
    if (req.session.user) {
        res.json({
            logado: true,
            usuario: req.session.user
        });
    } else {
        res.json({
            logado: false
        });
    }
});


app.use(express.urlencoded({ extended: true })); // Permite processar dados de formulário

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
// Rota para validar o login (POST)
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validações básicas
        if (!email || !senha) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
        }

        // Verifica se o e-mail existe no banco de dados
        const userResult = await pool.query('SELECT * FROM sga.usuario WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'E-mail não encontrado' });
        }

        // Verifica se a senha está correta
        const senhaResult = await pool.query('SELECT * FROM sga.usuario WHERE email = $1 AND senha = $2', [email, senha]);

        if (senhaResult.rows.length === 0) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Cria a sessão do usuário
        req.session.user = {
            id: userResult.rows[0].id_usuario,
            nome: userResult.rows[0].nome,
            email: userResult.rows[0].email
        };

        res.json({ message: 'Login bem-sucedido' });

    } catch (error) {
        console.error('Erro interno no servidor:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});


//TESTE DE ROTA
app.get('/api/testar-sessao', (req, res) => {
    if (req.session.user) {
        res.json({ logado: true, usuario: req.session.user });
    } else {
        res.json({ logado: false });
    }
});

app.get('/api/proximo_id_centro_estoque', async (req, res) => {
    try {
        // Busca o próximo valor da sequence correspondente
        const { rows } = await pool.query(`SELECT last_value + 1 AS proximo_id FROM sga.centro_estqoue_id_centro_estqoue_seq`);

        // Verifica se a sequence retornou um valor
        if (rows.length === 0 || rows[0].proximo_id === null) {
            // Tenta buscar o MAX ID da tabela como fallback (se a sequence estiver vazia/nova)
            const maxIdResult = await pool.query(`SELECT COALESCE(MAX(id_centro_estoque), 0) + 1 AS proximo_id FROM sga.centro_estoque`);
            return res.json(maxIdResult.rows[0]);
        }

        res.json(rows[0]);

    } catch (err) {
        console.error('Erro ao buscar próximo ID de centro_estoque:', err);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar próximo ID de centro_estoque',
            detalhes: err.message
        });
    }
});

app.get('/api/proximo_id_produto', async (req, res) => {
    try {
        // Busca o próximo valor da sequence correspondente
        const { rows } = await pool.query(`SELECT last_value + 1 AS proximo_id FROM sga.produto_id_produto_seq`);

        // Verifica se a sequence retornou um valor
        if (rows.length === 0 || rows[0].proximo_id === null) {
            // Tenta buscar o MAX ID da tabela como fallback (se a sequence estiver vazia/nova)
            const maxIdResult = await pool.query(`SELECT COALESCE(MAX(id_produto), 0) + 1 AS proximo_id FROM sga.produto`);
            return res.json(maxIdResult.rows[0]);
        }

        res.json(rows[0]);

    } catch (err) {
        console.error('Erro ao buscar próximo ID de produto:', err);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar próximo ID de produto',
            detalhes: err.message
        });
    }
});

app.get('/api/proximo_id_entrada_produto', async (req, res) => {
    try {
        // Busca o próximo valor da sequence correspondente
        const { rows } = await pool.query(`SELECT last_value + 1 AS proximo_id FROM sga.entrada_produto_id_seq`);

        // Verifica se a sequence retornou um valor
        if (rows.length === 0 || rows[0].proximo_id === null) {
            // Tenta buscar o MAX ID da tabela como fallback (se a sequence estiver vazia/nova)
            const maxIdResult = await pool.query(`SELECT COALESCE(MAX(id_entrada_produto), 0) + 1 AS proximo_id FROM sga.entrada_produto`);
            return res.json(maxIdResult.rows[0]);
        }

        res.json(rows[0]);

    } catch (err) {
        console.error('Erro ao buscar próximo ID de entrada_produto:', err);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar próximo ID de entrada_produto',
            detalhes: err.message
        });
    }
});

app.get('/api/proximo_id_saida_produto', async (req, res) => {
    try {
        // Busca o próximo valor da sequence correspondente
        const { rows } = await pool.query(`SELECT last_value + 1 AS proximo_id FROM sga.saida_produto_id_seq`);

        // Verifica se a sequence retornou um valor
        if (rows.length === 0 || rows[0].proximo_id === null) {
            // Tenta buscar o MAX ID da tabela como fallback (se a sequence estiver vazia/nova)
            const maxIdResult = await pool.query(`SELECT COALESCE(MAX(id_saida_produto), 0) + 1 AS proximo_id FROM sga.saida_produto`);
            return res.json(maxIdResult.rows[0]);
        }

        res.json(rows[0]);

    } catch (err) {
        console.error('Erro ao buscar próximo ID de saida_produto:', err);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar próximo ID de saida_produto',
            detalhes: err.message
        });
    }
});

app.get('/api/centro_estoque', async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT
            id_centro_estoque,
            nome_centro_estoque,
            localizacao_centro_estoque,
            padrao_centro_estoque,
            data_cadastro,
            descricao_centro_estoque
            FROM sga.centro_estoque WHERE inativo = FALSE`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar centro_estoque' });
    }
});

app.get('/api/id_centros_estoques', async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT
            id_centro_estoque
            FROM sga.centro_estoque`);
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
            p.corredor,
            p.prateleira,
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
        // Primeiro buscamos os contatos ativos
        const contatosQuery = await pool.query('SELECT * FROM sga.contato WHERE inativo = FALSE');
        const contatos = contatosQuery.rows;

        // Se não houver contatos, retornar array vazio
        if (contatos.length === 0) {
            return res.json([]);
        }

        // Buscamos todas as categorias dos contatos em uma única query
        const idsContatos = contatos.map(c => c.id_contato);
        const categoriasQuery = await pool.query(
            `SELECT cc.id_contato, cat.*
             FROM sga.contato_categoria cc
             JOIN sga.categoria_contato cat ON cc.id_categoria = cat.id_categoria
             WHERE cc.id_contato = ANY($1)`,
            [idsContatos]
        );

        // Mapeamos as categorias para cada contato
        const contatosComCategorias = contatos.map(contato => {
            const categorias = categoriasQuery.rows
                .filter(row => row.id_contato === contato.id_contato)
                .map(({ id_contato, ...categoria }) => categoria);

            return {
                ...contato,
                categorias
            };
        });

        res.json(contatosComCategorias);
    } catch (err) {
        console.error('Erro ao buscar contatos:', err);
        res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
});

// Rota GET para buscar UM endereço específico por ID (usando params)
app.get('/api/endereco/:id_endereco', async (req, res) => {
    const { id_endereco } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT * FROM sga.endereco WHERE id_endereco = $1`,
            [id_endereco]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }
        res.json(rows[0]); // Retorna apenas o primeiro resultado (deveria ser único)
    } catch (err) {
        console.error('Erro ao buscar endereço:', err);
        res.status(500).json({ error: 'Erro ao buscar endereço' });
    }
});

// Rota para buscar todos os dados da tabela entrada_produto
app.get('/api/entrada_produto', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        ep.*,
        c.razao_social AS fornecedor_razao_social,
        c.cnpj AS fornecedor_cnpj,
        COUNT(epi.id_item) AS total_itens,
        SUM(epi.quantidade) AS total_quantidade,
        SUM(epi.valor_total_item) AS valor_total_calculado
        FROM
            sga.entrada_produto ep
        INNER JOIN
            sga.contato c ON ep.fornecedor_id = c.id_contato
        LEFT JOIN
            sga.entrada_produto_itens epi ON ep.id_entrada_produto = epi.entrada_id
        WHERE
            ep.inativo = FALSE
        GROUP BY
            ep.id_entrada_produto, c.razao_social, c.cnpj
        ORDER BY
            ep.id_entrada_produto DESC;
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar aas de produto' });
    }
});

app.get('/api/saida_produto', async (req, res) => {
    try {
        // A consulta foi adaptada para seguir o padrão do seu endpoint de entrada.
        // Ela junta a saída com o contato (destinatário) e com os itens da saída.
        const result = await pool.query(`
            SELECT
                sp.id_saida_produto,
                sp.tipo_saida,
                sp.numero_nf,
                sp.data_saida,
                sp.valor_total,
                sp.status,
                sp.desconto,
                sp.serie,
                sp.modelo_documento_fiscal,
                sp.subserie,
                sp.chave_nfe,
                sp.destinatario_id,
                sp.data_criacao,
                c.razao_social AS destinatario_razao_social,
                c.cnpj AS destinatario_cnpj,
                COUNT(spi.id_item) AS total_itens,
                SUM(spi.quantidade) AS total_quantidade,
                SUM(spi.valor_total_item) AS valor_total_calculado
            FROM
                sga.saida_produto sp
            INNER JOIN
                sga.contato c ON sp.destinatario_id = c.id_contato
            LEFT JOIN
                sga.saida_produto_itens spi ON sp.id_saida_produto = spi.saida_id
            WHERE
                sp.inativo = FALSE
            GROUP BY
                sp.id_saida_produto, c.razao_social, c.cnpj
            ORDER BY
                sp.id_saida_produto DESC;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar saídas de produto:', err);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar saídas de produto' });
    }
});

app.get('/api/tipos_de_saida/:id', async (req, res) => {
    // Extrai o ID dos parâmetros da URL.
    const { id } = req.params;

    try {
        // Query para selecionar todas as colunas da tabela 'tipos_de_saida'
        // onde o ID corresponde ao parâmetro fornecido.
        const query = `
            SELECT * FROM sga.tipos_de_saida
            WHERE id_tipos_de_saida = $1;
        `;

        // Executa a query no banco de dados.
        const { rows } = await pool.query(query, [id]);

        // Se nenhum registro for encontrado (array 'rows' está vazio),
        // retorna um erro 404 (Not Found).
        if (rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Tipo de saída não encontrado.'
            });
        }

        // Se o registro for encontrado, retorna os dados com status 200 (OK).
        res.status(200).json({
            sucesso: true,
            tipo_saida: rows[0]
        });

    } catch (error) {
        // Em caso de erro no banco ou no servidor, loga o erro e retorna um status 500.
        console.error(`Erro ao buscar tipo de saída com ID ${id}:`, error);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro interno do servidor ao buscar o tipo de saída.',
            detalhes: error.message
        });
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
    const { produto, quantidade, preco_varejo, preco_atacado, corredor, prateleira, descricao, id_centro_estoque } = req.body;
    try {
        const query = `
            UPDATE sga.produto
            SET
                produto = $1,
                quantidade = $2,
                preco_varejo = $3,
                preco_atacado = $4,
                corredor = $5,
                prateleira = $6,
                descricao = $7,
                id_centro_estoque = $8
            WHERE id_produto = $9
            RETURNING *;
        `;
        const values = [produto, quantidade, preco_varejo, preco_atacado, corredor, prateleira, descricao, id_centro_estoque, id_produto];
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

app.put('/api/contato/:id_contato', async (req, res) => {
    const { id_contato } = req.params;
    const {
        razao_social,
        nome_fantasia,
        fone1,
        categoria,
        inativo,
        fone2,
        insc_municipal,
        insc_estadual,
        cnpj,
        cpf,
        email_padrao,
        perfil_tributario,
        tipo_consumidor,
        observacao,
        tipo_pessoa,
        situacao,
    } = req.body;

    try {
        // Validação básica dos campos obrigatórios
        if (!razao_social || !fone1 || !tipo_pessoa) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        // Validação de tipo de pessoa vs documento
        if (tipo_pessoa === 'Jurídica' && !cnpj) {
            return res.status(400).json({ error: 'CNPJ é obrigatório para pessoa jurídica' });
        }
        if (tipo_pessoa === 'Física' && !cpf) {
            return res.status(400).json({ error: 'CPF é obrigatório para pessoa física' });
        }

        const query = `
            UPDATE sga.contato SET
                razao_social = $1,
                nome_fantasia = $2,
                fone1 = $3,
                inativo = $4,
                fone2 = $5,
                insc_municipal = $6,
                insc_estadual = $7,
                cnpj = $8,
                cpf = $9,
                email_padrao = $10,
                perfil_tributario = $11,
                tipo_consumidor = $12,
                observacao = $13,
                tipo_pessoa = $14,
                situacao = $15
            WHERE id_contato = $16
            RETURNING *
        `;

        const values = [
            razao_social,
            nome_fantasia,
            fone1,
            inativo || false,
            fone2 || null,
            insc_municipal || null,
            insc_estadual || null,
            cnpj || null,
            cpf || null,
            email_padrao,
            perfil_tributario || null,
            tipo_consumidor || null,
            observacao || null,
            tipo_pessoa,
            situacao || 'Ativo',
            id_contato
        ];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar contato:', err);

        // Tratamento de erros específicos do PostgreSQL
        if (err.code === '23505') { // Violação de chave única
            return res.status(409).json({ error: 'Documento (CNPJ/CPF) já cadastrado' });
        }
        if (err.code === '23503') { // Violação de chave estrangeira
            return res.status(400).json({ error: 'Endereço não encontrado' });
        }

        res.status(500).json({ error: 'Erro ao atualizar contato' });
    }
});

// Endpoint para atualizar categorias de um contato (PUT)
app.put('/api/contato/:id_contato/categorias', async (req, res) => {
    const { id_contato } = req.params;
    const { categorias } = req.body; // Array de IDs de categorias

    try {
        // Validar entrada
        if (!Array.isArray(categorias)) {
            return res.status(400).json({ error: 'O campo "categorias" deve ser um array' });
        }

        // Verificar se o contato existe
        const contatoExiste = await pool.query(
            'SELECT 1 FROM sga.contato WHERE id_contato = $1',
            [id_contato]
        );

        if (contatoExiste.rowCount === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        // Iniciar transação
        await pool.query('BEGIN');

        // Remover todas as categorias atuais do contato
        await pool.query(
            'DELETE FROM sga.contato_categoria WHERE id_contato = $1',
            [id_contato]
        );

        // Inserir as novas categorias
        if (categorias.length > 0) {
            const values = categorias.map((id_categoria, index) =>
                `($${index * 2 + 1}, $${index * 2 + 2})`
            ).join(', ');

            const query = `
                INSERT INTO sga.contato_categoria (id_contato, id_categoria)
                VALUES ${values}
            `;

            const flatValues = categorias.flatMap(id_categoria => [id_contato, id_categoria]);
            await pool.query(query, flatValues);

            res.status(200).json({ message: 'Categorias atualizadas com sucesso!' });
        }

        // Commit da transação
        await pool.query('COMMIT');
    } catch (err) {
        // Rollback em caso de erro
        await pool.query('ROLLBACK');
        console.error('Erro ao atualizar categorias do contato:', err);

        if (err.code === '23503') { // Foreign key violation
            res.status(400).json({ error: 'Uma ou mais categorias não existem' });
        } else {
            res.status(500).json({ error: 'Erro ao atualizar categorias do contato' });
        }
    }
});

app.put('/api/endereco/:id_endereco', async (req, res) => {
    const { id_endereco } = req.params;
    const {
        cep,
        municipio,
        estado,
        pais,
        ponto_referencia,
        setor,
        endereco
    } = req.body;

    try {
        // Query de atualização
        const query = `
            UPDATE sga.endereco SET
                cep = $1,
                endereco = $2,
                municipio = $3,
                estado = $4,
                pais = $5,
                ponto_referencia = $6,
                setor = $7
            WHERE id_endereco = $8
            RETURNING *
        `;

        const values = [
            cep,
            endereco || null,
            municipio,
            estado,
            pais || 'Brasil',
            ponto_referencia || null,
            setor || null,
            id_endereco
        ];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Endereço não encontrado'
            });
        }

        res.json({
            success: true,
            endereco: rows[0]
        });

    } catch (err) {
        console.error('Erro ao atualizar endereço:', err);

        if (err.code === '23505') { // Violação de constraint única
            res.status(409).json({
                success: false,
                error: 'Violação de regra única no banco de dados'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Erro ao atualizar endereço'
            });
        }
    }
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
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sga.usuario');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
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

// Rota para inserir entrada de produto
app.post('/entrada_produto', async (req, res) => {
    const {
        tipo_entrada,
        numero_nf,
        data_recebimento,
        fornecedor,
        valor_total,
        desconto,
        status,
        modelo,
        serie,
        sub_serie,
        data_emissao,
        chave_nfe,
        itens
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Remover os triggers problemáticos temporariamente
        await client.query(`
      DROP TRIGGER IF EXISTS trg_recalcular_total_entrada ON sga.entrada_produto_itens;
      DROP FUNCTION IF EXISTS sga.recalcular_total_entrada();
    `);

        // 2. Recriar a função com esquema qualificado
        await client.query(`
      CREATE OR REPLACE FUNCTION sga.recalcular_total_entrada()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE sga.entrada_produto ep
        SET valor_total = (
          SELECT COALESCE(SUM(epi.valor_total_item), 0)
          FROM sga.entrada_produto_itens epi
          WHERE epi.entrada_id = ep.id_entrada_produto
        )
        WHERE ep.id_entrada_produto = NEW.entrada_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

        // 3. Recriar o trigger
        await client.query(`
      CREATE TRIGGER trg_recalcular_total_entrada
      AFTER INSERT OR UPDATE OR DELETE ON sga.entrada_produto_itens
      FOR EACH ROW EXECUTE FUNCTION sga.recalcular_total_entrada();
    `);

        // 4. Inserir o cabeçalho da entrada
        const entradaResult = await client.query(
            `INSERT INTO sga.entrada_produto (
        tipo_entrada, numero_nf, data_recebimento, fornecedor_id, valor_total,
        desconto, status, data_criacao,
        modelo_documento_fiscal, serie, subserie, data_emissao, chave_nfe
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, CURRENT_TIMESTAMP,
        $8, $9, $10, $11, $12
      ) RETURNING id_entrada_produto`,
            [
                tipo_entrada,
                numero_nf,
                data_recebimento,
                fornecedor,
                valor_total || 0,
                desconto || 0,
                status,
                modelo,
                serie,
                sub_serie,
                data_emissao,
                chave_nfe
            ]
        );

        const entradaId = entradaResult.rows[0].id_entrada_produto;

        // 5. Inserir os itens da entrada
        for (const item of itens) {
            await client.query(
                `INSERT INTO sga.entrada_produto_itens (
          entrada_id, produto_id, quantidade, valor_unitario,
          desconto_item
        ) VALUES (
          $1, $2, $3, $4, $5
        )`,
                [
                    entradaId,
                    item.id_produto,
                    item.quantidade,
                    item.valor_unitario,
                    item.desconto || 0
                ]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            sucesso: true,
            entrada_id: entradaId,
            message: 'Entrada de produto e itens cadastrados com sucesso'
        });

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('Erro detalhado:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            detail: error.detail,
            query: error.query
        });

        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao processar entrada de produto',
            detalhes: error.message,
            codigo_erro: error.code,
            query_erro: error.query
        });
    } finally {
        client.release();
    }
});

/**
 * @route   POST /api/saidas-produto
 * @desc    Cria uma nova saída de produto, incluindo seus itens, usando uma transação.
 * @access  Public
 */
app.post('/saida_produto', async (req, res) => {
    // É crucial usar um 'client' do pool para garantir que todos os comandos
    // executem na mesma conexão dentro da transação.
    const client = await pool.connect();

    try {
        // 1. Extrai os dados do cabeçalho e o array de itens do corpo da requisição.
        const {
            tipo_saida,
            numero_nf,
            data_saida,
            destinatario_id,
            valor_total,
            desconto,
            status,
            modelo_documento_fiscal,
            serie,
            subserie,
            data_emissao,
            chave_nfe,
            inativo,
            itens // Array de objetos, ex: [{ produto_id: 1, quantidade: 10, valor_unitario: 5.50, desconto_item: 1.00 }, ...]
        } = req.body;

        // 2. Validações principais
        if (!tipo_saida || !numero_nf || !data_saida || !destinatario_id) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Campos obrigatórios do cabeçalho da saída estão faltando (tipo_saida, numero_nf, data_saida, destinatario_id).'
            });
        }
        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                sucesso: false,
                erro: 'É necessário fornecer pelo menos um item para a saída.'
            });
        }
        // Validação básica de cada item
        for (const item of itens) {
            if (!item.id_produto || !item.quantidade || !item.valor_unitario) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Cada item deve conter id_produto, quantidade e valor_unitario.'
                });
            }
        }

        // =================================================================
        // INÍCIO DA TRANSAÇÃO
        // =================================================================
        await client.query('BEGIN');

        // 3. Insere o cabeçalho da saída para obter o 'id_saida_produto'.
        const saidaQuery = `
            INSERT INTO sga.saida_produto (
                tipo_saida, numero_nf, data_saida, destinatario_id, valor_total,
                desconto, status, modelo_documento_fiscal, serie, subserie,
                data_emissao, chave_nfe, inativo
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            ) RETURNING *;
        `;
        const saidaValues = [
            tipo_saida, numero_nf, data_saida, destinatario_id, valor_total || null,
            desconto || 0, status || 'Pendente', modelo_documento_fiscal || null, serie || null, subserie || null,
            data_emissao || null, chave_nfe || null, inativo || false
        ];
        const saidaResult = await client.query(saidaQuery, saidaValues);
        const novaSaida = saidaResult.rows[0];
        const novaSaidaId = novaSaida.id_saida_produto;

        // 4. Insere os itens na tabela 'saida_produto_itens'.
        const itensInseridos = [];
        for (const item of itens) {
            const itemQuery = `
                INSERT INTO sga.saida_produto_itens (
                    saida_id, id_produto, quantidade, valor_unitario, desconto_item, inativo
                ) VALUES (
                    $1, $2, $3, $4, $5, $6
                ) RETURNING *;
            `;
            const itemValues = [
                novaSaidaId,
                item.id_produto,
                item.quantidade,
                item.valor_unitario,
                item.desconto_item || 0,
                item.inativo || false
            ];
            const itemResult = await client.query(itemQuery, itemValues);
            itensInseridos.push(itemResult.rows[0]);
        }

        // =================================================================
        // FIM DA TRANSAÇÃO
        // =================================================================
        await client.query('COMMIT');

        // 5. Retorna a saída recém-criada e seus itens com status 201 (Created).
        res.status(201).json({
            sucesso: true,
            mensagem: 'Saída de produto criada com sucesso!',
            saida: novaSaida,
            itens: itensInseridos
        });

    } catch (err) {
        // Se qualquer um dos comandos acima falhar, desfaz todas as alterações.
        await client.query('ROLLBACK');
        console.error('Erro na transação de inserção de saída de produto:', err);

        // Tratamento de erros específicos do PostgreSQL
        if (err.code === '23505') { // Violação de chave única (ex: numero_nf duplicado?)
            return res.status(409).json({ sucesso: false, erro: `Já existe um registro com este valor. Detalhe: ${err.detail || err.message}` });
        }
        if (err.code === '23503') { // Violação de chave estrangeira (ex: destinatario_id ou id_produto não existe)
            return res.status(400).json({ sucesso: false, erro: 'ID do destinatário ou de algum produto não encontrado.' });
        }

        res.status(500).json({
            sucesso: false,
            erro: 'Erro interno do servidor ao cadastrar saída de produto.',
            detalhes: err.message
        });
    } finally {
        // Libera o 'client' de volta para o pool, independentemente do resultado.
        client.release();
    }
});


// Rota para buscar todos os itens de uma entrada de produto específica
// Exemplo: GET /entrada_produto/1/itens
app.get('/api/entrada_produto/:id/itens', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
      SELECT
        epi.id_item,
        epi.entrada_id,
        epi.produto_id,
        p.produto AS nome_produto,
        epi.quantidade,
        epi.valor_unitario,
        epi.desconto_item,
        epi.valor_total_item
      FROM sga.entrada_produto_itens epi
      JOIN sga.produto p ON epi.produto_id = p.id_produto
      WHERE epi.entrada_id = $1
      ORDER BY epi.id_item
    `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Nenhum item encontrado para esta entrada ou entrada não existe'
            });
        }

        res.status(200).json({
            sucesso: true,
            quantidade_itens: result.rows.length,
            itens: result.rows
        });

    } catch (error) {
        console.error('Erro ao buscar itens da entrada:', error);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar itens da entrada',
            detalhes: error.message
        });
    }
});

app.get('/api/saida_produto/:id/itens', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT
                spi.id_item,
                spi.saida_id,
                spi.id_produto,
                p.produto AS nome_produto,
                spi.quantidade,
                spi.valor_unitario,
                spi.desconto_item,
                spi.valor_total_item
            FROM sga.saida_produto_itens spi
            JOIN sga.produto p ON spi.id_produto = p.id_produto
            WHERE spi.saida_id = $1
            ORDER BY spi.id_item
        `;

        const result = await pool.query(query, [id]);

        // A verificação `result.rows.length === 0` é importante para o caso de uma
        // saída que foi criada mas ainda não tem itens adicionados.
        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Nenhum item encontrado para esta saída ou saída não existe'
            });
        }

        res.status(200).json({
            sucesso: true,
            quantidade_itens: result.rows.length,
            itens: result.rows
        });

    } catch (error) {
        console.error('Erro ao buscar itens da saída:', error);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar itens da saída',
            detalhes: error.message
        });
    }
});

app.get('/api/tipos_de_saida/:id', async (req, res) => {
    // Extrai o ID dos parâmetros da URL.
    const { id } = req.params;

    try {
        // Query para selecionar todas as colunas da tabela 'tipos_de_saida'
        // onde o ID corresponde ao parâmetro fornecido.
        const query = `
            SELECT * FROM sga.tipos_de_saida
            WHERE id_tipos_de_saida = $1;
        `;

        // Executa a query no banco de dados.
        const { rows } = await pool.query(query, [id]);

        // Se nenhum registro for encontrado (array 'rows' está vazio),
        // retorna um erro 404 (Not Found).
        if (rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Tipo de saída não encontrado.'
            });
        }

        // Se o registro for encontrado, retorna os dados com status 200 (OK).
        res.status(200).json({
            sucesso: true,
            tipo_saida: rows[0]
        });

    } catch (error) {
        // Em caso de erro no banco ou no servidor, loga o erro e retorna um status 500.
        console.error(`Erro ao buscar tipo de saída com ID ${id}:`, error);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro interno do servidor ao buscar o tipo de saída.',
            detalhes: error.message
        });
    }
});

app.put('/entrada_produto/:id', async (req, res) => {
    const { id } = req.params;
    const {
        tipo_entrada,
        numero_nf,
        data_recebimento,
        fornecedor,
        valor_total,
        desconto,
        status,
        modelo,
        serie,
        sub_serie,
        data_emissao,
        chave_nfe,
        itens
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Atualizar o cabeçalho da entrada
        const updateEntradaQuery = `
      UPDATE sga.entrada_produto
      SET
        tipo_entrada = $1,
        numero_nf = $2,
        data_recebimento = $3,
        fornecedor_id = $4,
        valor_total = $5,
        desconto = $6,
        status = $7,
        modelo_documento_fiscal = $8,
        serie = $9,
        subserie = $10,
        data_emissao = $11,
        chave_nfe = $12
      WHERE id_entrada_produto = $13
      RETURNING *;
    `;

        const entradaResult = await client.query(updateEntradaQuery, [
            tipo_entrada,
            numero_nf,
            data_recebimento,
            fornecedor,
            valor_total,
            desconto,
            status,
            modelo,
            serie,
            sub_serie,
            data_emissao,
            chave_nfe,
            id
        ]);

        if (entradaResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Entrada de produto não encontrada'
            });
        }

        // 2. Remover todos os itens existentes (opcional - pode ser substituído por atualização individual)
        await client.query(
            'DELETE FROM sga.entrada_produto_itens WHERE entrada_id = $1',
            [id]
        );

        // 3. Inserir os novos itens da entrada
        for (const item of itens) {
            await client.query(
                `INSERT INTO sga.entrada_produto_itens (
          entrada_id, produto_id, quantidade, valor_unitario,
          desconto_item
        ) VALUES (
          $1, $2, $3, $4, $5
        )`,
                [
                    id,
                    item.id_produto,
                    item.quantidade,
                    item.valor_unitario,
                    item.desconto || 0,
                ]
            );
        }

        await client.query('COMMIT');

        // 4. Obter os dados atualizados completos para retornar
        const entradaCompleta = await client.query(
            `SELECT * FROM sga.entrada_produto WHERE id_entrada_produto = $1`,
            [id]
        );

        const itensAtualizados = await client.query(
            `SELECT * FROM sga.entrada_produto_itens WHERE entrada_id = $1`,
            [id]
        );

        res.status(200).json({
            sucesso: true,
            mensagem: 'Entrada de produto atualizada com sucesso',
            entrada: entradaCompleta.rows[0],
            itens: itensAtualizados.rows
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao atualizar entrada:', error);

        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao atualizar entrada de produto',
            detalhes: error.message,
            codigo_erro: error.code
        });
    } finally {
        client.release();
    }
});

app.put('/saida_produto/:id', async (req, res) => {
    const { id } = req.params;
    const {
        tipo_saida,
        numero_nf,
        data_saida,
        destinatario_id,
        valor_total,
        desconto,
        status,
        modelo_documento_fiscal,
        serie,
        subserie,
        data_emissao,
        chave_nfe,
        itens // Array de objetos de itens
    } = req.body;

    // Conecta ao banco para usar o mesmo cliente na transação
    const client = await pool.connect();

    try {
        // Inicia a transação
        await client.query('BEGIN');

        // 1. Atualizar o cabeçalho da saída de produto
        const updateSaidaQuery = `
            UPDATE sga.saida_produto
            SET
                tipo_saida = $1,
                numero_nf = $2,
                data_saida = $3,
                destinatario_id = $4,
                valor_total = $5,
                desconto = $6,
                status = $7,
                modelo_documento_fiscal = $8,
                serie = $9,
                subserie = $10,
                data_emissao = $11,
                chave_nfe = $12
            WHERE id_saida_produto = $13
            RETURNING *;
        `;
        const saidaResult = await client.query(updateSaidaQuery, [
            tipo_saida, numero_nf, data_saida, destinatario_id, valor_total,
            desconto, status, modelo_documento_fiscal, serie, subserie,
            data_emissao, chave_nfe, id
        ]);

        if (saidaResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Saída de produto não encontrada'
            });
        }

        // 2. Remover todos os itens existentes para esta saída
        await client.query(
            'DELETE FROM sga.saida_produto_itens WHERE saida_id = $1',
            [id]
        );

        // 3. Inserir os novos itens da saída, se houver
        if (itens && Array.isArray(itens) && itens.length > 0) {
            for (const item of itens) {
                await client.query(
                    `INSERT INTO sga.saida_produto_itens (
                        saida_id, id_produto, quantidade, valor_unitario, desconto_item
                    ) VALUES ($1, $2, $3, $4, $5)`,
                    [
                        id,
                        item.id_produto, // Garanta que o front-end envie 'id_produto'
                        item.quantidade,
                        item.valor_unitario,
                        item.desconto_item || 0
                    ]
                );
            }
        }

        // Confirma a transação
        await client.query('COMMIT');

        // 4. Obter os dados atualizados completos para retornar
        const saidaCompleta = await client.query(
            `SELECT * FROM sga.saida_produto WHERE id_saida_produto = $1`,
            [id]
        );
        const itensAtualizados = await client.query(
            `SELECT * FROM sga.saida_produto_itens WHERE saida_id = $1`,
            [id]
        );

        res.status(200).json({
            sucesso: true,
            mensagem: 'Saída de produto atualizada com sucesso',
            saida: saidaCompleta.rows[0],
            itens: itensAtualizados.rows
        });

    } catch (error) {
        // Em caso de erro, desfaz a transação
        await client.query('ROLLBACK');
        console.error('Erro ao atualizar saída:', error);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao atualizar saída de produto',
            detalhes: error.message
        });
    } finally {
        // Libera o cliente de volta para o pool
        client.release();
    }
});

// Rota para upload da imagem
app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        // 2. Validar arquivo e userId
        if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        const userId = req.body.userId;
        if (!userId) return res.status(400).json({ error: 'ID do usuário não fornecido' });

        // 4. Processar imagem
        const optimizedImage = await sharp(req.file.buffer)
            .resize(300, 300)
            .webp({ quality: 80 })
            .toBuffer();

        supabase.storage.from('fotos-usuarios').remove(`${userId}.webp`);
        // 5. Fazer upload
        const filePath = `${userId}.webp`;
        const { error } = await supabase.storage
            .from('fotos-usuarios')
            .upload(filePath, optimizedImage, {
                contentType: 'image/webp',
                upsert: true
            });

        if (error) throw error;

        // 6. Retornar URL
        const { data: { publicUrl } } = supabase.storage
            .from('fotos-usuarios')
            .getPublicUrl(filePath);

        res.json({ success: true, url: publicUrl });

    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({
            error: 'Erro no upload',
            details: err.message,
            supabaseError: err.statusCode === 403 ? 'Acesso não autorizado - verifique as políticas RLS' : null
        });
    }
});


// Rota para buscar imagem por ID
// Rota GET /api/imagem/:id
app.get('/api/imagem/:id', async (req, res) => {
    const { id } = req.params;
    const fileName = `${id}.webp`;

    // 1. Verifica existência REAL no bucket
    const { data: fileList } = await supabase.storage
        .from('fotos-usuarios')
        .list('', { search: fileName });

    if (!fileList?.length) {
        return res.json({ error: 'Imagem não existe mais' }); // ❌
    }

    // 2. Gera URL somente se o arquivo existir
    const { data: { publicUrl } } = supabase.storage
        .from('fotos-usuarios')
        .getPublicUrl(fileName);

    res.json({
        exists: true, // ✅ Novo campo
        imageUrl: publicUrl
    });
});

// Rota POST para inserir novo tipo_entrada
app.post('/tipos_entrada', async (req, res) => {
    const {
        id_tipo_de_entrada,
        descricao,
        cfop_dentro,
        cfop_fora,
        ativo,
        movimenta_estoque,
        hab_agrupamento,
        hab_movimento,
        habilita_nf,
        atualiza_produto,
        padrao
    } = req.body;

    try {
        const query = `
            INSERT INTO sga.tipos_entrada
            (id_tipo_de_entrada, descricao, cfop_dentro, cfop_fora, ativo, movimenta_estoque, hab_agrupamento, hab_movimento, habilita_nf, atualiza_produto, padrao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
        const values = [id_tipo_de_entrada, descricao, cfop_dentro, cfop_fora, ativo, movimenta_estoque, hab_agrupamento, hab_movimento, habilita_nf, atualiza_produto, padrao];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Tipo de entrada criado com sucesso!', tipo_entrada: result.rows[0] });
    } catch (err) {
        console.error('Erro ao inserir tipo_entrada:', err);
        res.status(500).json({ message: 'Erro ao inserir tipo_entrada', error: err.message });
    }
});

app.post('/centros-estoque', async (req, res) => {
    // Extrai os dados do corpo da requisição
    const {
        descricao_centro_estoque,
        localizacao_centro_estoque,
        padrao_centro_estoque,
        nome_centro_estoque, // Opcional, pois tem DEFAULT
        inativo // Opcional, pois tem DEFAULT
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!descricao_centro_estoque || !localizacao_centro_estoque || typeof padrao_centro_estoque !== 'boolean') {
        return res.status(400).json({
            error: 'Campos obrigatórios estão faltando ou são inválidos: descricao_centro_estoque, localizacao_centro_estoque, padrao_centro_estoque (boolean).'
        });
    }

    try {
        const insertQuery = `
      INSERT INTO sga.centro_estoque
        (descricao_centro_estoque, localizacao_centro_estoque, padrao_centro_estoque, nome_centro_estoque, inativo)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

        // O valor de 'inativo' será false se não for enviado.
        const inativoValue = typeof inativo === 'boolean' ? inativo : false;

        // O valor de 'nome_centro_estoque' usará o DEFAULT do banco se for null/undefined
        const values = [
            descricao_centro_estoque,
            localizacao_centro_estoque,
            padrao_centro_estoque,
            nome_centro_estoque, // Se for null, o DEFAULT 'Padrão' será usado pelo banco
            inativoValue
        ];

        const result = await pool.query(insertQuery, values);

        // Retorna o registro recém-criado com status 201 (Created)
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao inserir no banco de dados:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota para criar um novo produto.
app.post('/produtos', async (req, res) => {
    // 1. Extrai os dados do corpo da requisição.
    const {
        produto,          // Obrigatório
        quantidade,       // Obrigatório
        preco_varejo,     // Obrigatório
        preco_atacado,    // Obrigatório
        descricao,        // Opcional
        corredor,         // Opcional
        prateleira,       // Opcional
        inativo,          // Opcional (padrão: false)
        id_centro_estoque // Opcional (padrão: 1)
    } = req.body;

    // 2. Validação dos campos obrigatórios e seus tipos.
    if (!produto || typeof quantidade !== 'number' || typeof preco_varejo !== 'number' || typeof preco_atacado !== 'number') {
        return res.status(400).json({
            error: 'Campos obrigatórios estão faltando ou com tipos inválidos. Campos requeridos: produto(string), quantidade(number), preco_varejo(number), preco_atacado(number).'
        });
    }

    // 3. Bloco try...catch para lidar com possíveis erros do banco de dados.
    try {
        // 4. Comando SQL parametrizado para evitar SQL Injection.
        const insertQuery = `
      INSERT INTO sga.produto
        (produto, quantidade, preco_varejo, preco_atacado, corredor, prateleira descricao, inativo, id_centro_estoque)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

        // 5. Monta o array de valores, tratando os campos opcionais.
        const values = [
            produto,
            quantidade,
            preco_varejo,
            preco_atacado,
            corredor,
            prateleira,
            descricao || null, // Se a descrição não for enviada, insere NULL no banco.
            typeof inativo === 'boolean' ? inativo : false, // Se 'inativo' não for um booleano, assume 'false'.
            id_centro_estoque || 1 // Se 'id_centro_estoque' não for enviado, assume '1'.
        ];

        // 6. Executa a query no banco de dados.
        const result = await pool.query(insertQuery, values);

        // 7. Retorna o registro recém-criado com status 201 (Created).
        res.status(201).json(result.rows[0]);

    } catch (error) {
        // 8. Em caso de erro, loga no console e retorna uma mensagem genérica.
        console.error('Erro ao inserir produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao tentar cadastrar o produto.' });
    }
});

// POST /api/contatos
// Rota para criar um novo contato, incluindo seu endereço e categorias, usando uma transação.
app.post('/api/contatos', async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            razao_social,
            nome_fantasia,
            fone1,
            fone2,
            insc_municipal,
            insc_estadual,
            cnpj,
            cpf,
            email_padrao,
            perfil_tributario,
            tipo_consumidor,
            observacao,
            tipo_pessoa,
            situacao,
            inativo,
            endereco, // Objeto aninhado com os dados do endereço
            categorias, // Array de IDs de categoria, ex: [1, 3, 5]
        } = req.body;

        // 2. Validações principais
        if (!razao_social || !fone1 || !tipo_pessoa) {
            return res.status(400).json({ error: 'Campos obrigatórios do contato estão faltando (razao_social, fone1, tipo_pessoa).' });
        }
        if (tipo_pessoa === 'Jurídica' && !cnpj) {
            return res.status(400).json({ error: 'CNPJ é obrigatório para pessoa jurídica.' });
        }
        if (tipo_pessoa === 'Física' && !cpf) {
            return res.status(400).json({ error: 'CPF é obrigatório para pessoa física.' });
        }
        // Validação do endereço aninhado
        if (!endereco || !endereco.cep || !endereco.municipio || !endereco.estado || !endereco.endereco) {
            return res.status(400).json({ error: 'O objeto de endereço e seus campos obrigatórios (cep, municipio, estado, endereco) são necessários.' });
        }

        // =================================================================
        // INÍCIO DA TRANSAÇÃO
        // =================================================================
        await client.query('BEGIN');

        // 3. Insere o endereço primeiro para obter o 'id_endereco'.
        const enderecoQuery = `
            INSERT INTO sga.endereco (cep, municipio, estado, pais, ponto_referencia, setor, endereco)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_endereco;
        `;
        const enderecoValues = [
            endereco.cep,
            endereco.municipio,
            endereco.estado,
            endereco.pais || 'Brasil',
            endereco.ponto_referencia || null,
            endereco.setor || null,
            endereco.endereco
        ];
        const enderecoResult = await client.query(enderecoQuery, enderecoValues);
        const novoEnderecoId = enderecoResult.rows[0].id_endereco;

        // 4. Insere o contato, usando o 'id_endereco' que acabamos de criar.
        const contatoQuery = `
            INSERT INTO sga.contato (
                razao_social, nome_fantasia, fone1, fone2, insc_municipal, insc_estadual,
                cnpj, cpf, email_padrao, perfil_tributario, tipo_consumidor,
                observacao, tipo_pessoa, situacao, inativo, fk_id_endereco
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
            ) RETURNING *;
        `;
        const contatoValues = [
            razao_social, nome_fantasia || null, fone1, fone2 || null, insc_municipal || null, insc_estadual || null,
            cnpj || null, cpf || null, email_padrao || null, perfil_tributario || null, tipo_consumidor || null,
            observacao || null, tipo_pessoa, situacao || 'Ativo', inativo || false, novoEnderecoId
        ];
        const contatoResult = await client.query(contatoQuery, contatoValues);
        const novoContato = contatoResult.rows[0];

        // 5. Insere as categorias na tabela de junção 'contato_categoria'.
        if (categorias && Array.isArray(categorias) && categorias.length > 0) {
            const valuesPlaceholder = categorias.map((_, index) =>
                `($1, $${index + 2})`
            ).join(', ');

            const categoriaQuery = `
                INSERT INTO sga.contato_categoria (id_contato, id_categoria)
                VALUES ${valuesPlaceholder};
            `;
            // O primeiro valor é sempre o id_contato, seguido pelos ids das categorias
            const categoriaValues = [novoContato.id_contato, ...categorias];
            await client.query(categoriaQuery, categoriaValues);
        }

        // =================================================================
        // FIM DA TRANSAÇÃO
        // =================================================================
        await client.query('COMMIT');

        // 6. Retorna o contato recém-criado com status 201 (Created).
        res.status(201).json(novoContato);

    } catch (err) {
        // Se qualquer um dos comandos acima falhar, desfaz todas as alterações.
        await client.query('ROLLBACK');
        console.error('Erro na transação de inserção de contato:', err);

        // Tratamento de erros específicos do PostgreSQL (similar ao seu código)
        if (err.code === '23505') { // Violação de chave única
            return res.status(409).json({ error: `Já existe um registro com este valor. Detalhe: ${err.detail}` });
        }
        if (err.code === '23503') { // Violação de chave estrangeira
            return res.status(400).json({ error: 'Uma ou mais categorias fornecidas não existem.' });
        }

        res.status(500).json({ error: 'Erro interno do servidor ao cadastrar contato.' });
    } finally {
        // Libera o 'client' de volta para o pool, independentemente do resultado.
        client.release();
    }
});

// Rota GET para listar todos os tipos_entrada
app.get('/api/tipos_entrada', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sga.tipos_entrada ORDER BY id_tipo_de_entrada');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar tipos_entrada:', err);
        res.status(500).json({ message: 'Erro ao buscar tipos_entrada', error: err.message });
    }
});
app.put('/tipos_entrada/:id', async (req, res) => {
    const { id } = req.params;
    const {
        descricao,
        cfop_dentro,
        cfop_fora,
        ativo,
        movimenta_estoque,
        hab_agrupamento,
        hab_movimento,
        habilita_nf,
        atualiza_produto,
        padrao
    } = req.body;

    try {
        const query = `
            UPDATE sga.tipos_entrada
            SET
                descricao = $1,
                cfop_dentro = $2,
                cfop_fora = $3,
                ativo = $4,
                movimenta_estoque = $5,
                hab_agrupamento = $6,
                hab_movimento = $7,
                habilita_nf = $8,
                atualiza_produto = $9,
                padrao = $10
            WHERE id_tipo_de_entrada = $11
            RETURNING *;
        `;

        const values = [
            descricao,
            cfop_dentro,
            cfop_fora,
            ativo,
            movimenta_estoque,
            hab_agrupamento,
            hab_movimento,
            habilita_nf,
            atualiza_produto,
            padrao,
            id
        ];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tipo de entrada não encontrado.' });
        }

        res.status(200).json({
            message: 'Tipo de entrada atualizado com sucesso.',
            tipo_entrada: result.rows[0]
        });

    } catch (err) {
        console.error('Erro ao atualizar tipo de entrada:', err);
        res.status(500).json({ message: 'Erro ao atualizar tipo de entrada', error: err.message });
    }
});


app.delete('/tipos_entrada/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        await pool.query(
            `
                DELETE FROM sga.tipos_entrada
                WHERE id_tipo_de_entrada = $1
                RETURNING *;
            `
            , [id]);
        res.status(200).json({ message: 'Tipo de entrada excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir' });
    }
});

app.delete('/api/remove-foto/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const fileName = `${userId}.webp`; // Padrão de nomeação

        // 1. Verifica se o arquivo existe
        const { data: fileList } = await supabase.storage
            .from('fotos-usuarios')
            .list('', {
                search: fileName
            });

        if (!fileList || fileList.length === 0) {
            return res.status(404).json({ error: 'Foto não encontrada' });
        }

        // 2. Remove o arquivo
        const { error } = await supabase.storage
            .from('fotos-usuarios')
            .remove([fileName]);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Foto removida com sucesso'
        });

    } catch (error) {
        console.error('Erro ao remover foto:', error);
        res.status(500).json({
            error: 'Erro ao remover foto',
            details: error.message
        });
    }
});

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

// Endpoint para inativar entrada de produto (DELETE)
app.delete('/entrada_produto/:id_entrada', async (req, res) => {
    const { id_entrada } = req.params;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Verificar se a entrada existe
        const entradaExistente = await client.query(
            'SELECT 1 FROM sga.entrada_produto WHERE id_entrada_produto = $1 AND inativo = FALSE',
            [id_entrada]
        );

        if (entradaExistente.rowCount === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Entrada não encontrada ou já inativada'
            });
        }

        // 2. Inativar a entrada principal
        await client.query(`
            UPDATE sga.entrada_produto
            SET inativo = TRUE
            WHERE id_entrada_produto = $1
        `, [id_entrada]);

        // 3. Opcional: Inativar também os itens relacionados
        await client.query(`
            UPDATE sga.entrada_produto_itens
            SET inativo = TRUE
            WHERE entrada_id = $1
        `, [id_entrada]);

        await client.query('COMMIT');

        res.status(200).json({
            sucesso: true,
            mensagem: 'Entrada de produto inativada com sucesso!',
            id_entrada: id_entrada
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao inativar entrada:', err);

        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao inativar entrada de produto',
            detalhes: err.message
        });
    } finally {
        client.release();
    }
});

app.delete('/saida_produto/:id', async (req, res) => {
    // Extrai o ID da saída dos parâmetros da URL
    const { id } = req.params;

    // Obtém um cliente do pool para a transação
    const client = await pool.connect();

    try {
        // Inicia a transação
        await client.query('BEGIN');

        // 1. Verifica se a saída existe e ainda está ativa
        const saidaExistente = await client.query(
            'SELECT 1 FROM sga.saida_produto WHERE id_saida_produto = $1 AND inativo = FALSE',
            [id]
        );

        // Se não encontrar (rowCount === 0), retorna erro 404
        if (saidaExistente.rowCount === 0) {
            await client.query('ROLLBACK'); // Desfaz a transação iniciada
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Saída de produto não encontrada ou já inativada.'
            });
        }

        // 2. Marca o registro principal da saída como inativo
        await client.query(`
            UPDATE sga.saida_produto
            SET inativo = TRUE
            WHERE id_saida_produto = $1
        `, [id]);

        // 3. Marca os itens relacionados na tabela 'saida_produto_itens' como inativos
        await client.query(`
            UPDATE sga.saida_produto_itens
            SET inativo = TRUE
            WHERE saida_id = $1
        `, [id]);

        // Confirma a transação
        await client.query('COMMIT');

        // Retorna sucesso
        res.status(200).json({
            sucesso: true,
            mensagem: 'Saída de produto inativada com sucesso!',
            id_saida_produto: id
        });

    } catch (err) {
        // Em caso de erro, desfaz a transação
        await client.query('ROLLBACK');
        console.error(`Erro ao inativar saída de produto com ID ${id}:`, err);

        // Retorna erro genérico 500
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao inativar saída de produto.',
            detalhes: err.message
        });
    } finally {
        // Libera o cliente de volta para o pool
        client.release();
    }
});

// Rota GET para listar todos os tipos_de_saida
app.get('/api/tipos_de_saida', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sga.tipos_de_saida ORDER BY id_tipos_de_saida');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar tipos_de_saida:', err);
        res.status(500).json({ message: 'Erro ao buscar tipos_de_saida', error: err.message });
    }
});

app.put('/tipo_de_saida/:id', async (req, res) => {
    const { id } = req.params;
    const {
        descricao,
        cfop_dentro,
        cfop_fora,
        ativo,
        movimenta_estoque,
        hab_agrupamento,
        hab_movimento,
        habilita_nf,
        atualiza_produto,
        padrao
    } = req.body;

    try {
        const query = `
            UPDATE sga.tipos_de_saida
            SET
                descricao = $1,
                cfop_dentro = $2,
                cfop_fora = $3,
                ativo = $4,
                movimenta_estoque = $5,
                hab_agrupamento = $6,
                hab_movimento = $7,
                habilita_nf = $8,
                atualiza_produto = $9,
                padrao = $10
            WHERE id_tipo_de_entrada = $11
            RETURNING *;
        `;

        const values = [
            descricao,
            cfop_dentro,
            cfop_fora,
            ativo,
            movimenta_estoque,
            hab_agrupamento,
            hab_movimento,
            habilita_nf,
            atualiza_produto,
            padrao,
            id
        ];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tipo de saida não encontrado.' });
        }

        res.status(200).json({
            message: 'Tipo de saida atualizado com sucesso.',
            tipo_entrada: result.rows[0]
        });

    } catch (err) {
        console.error('Erro ao atualizar tipo de saida:', err);
        res.status(500).json({ message: 'Erro ao atualizar tipo de saida', error: err.message });
    }
});

// Rota POST para inserir novo tipo de saida
app.post('/tipo_de_saida', async (req, res) => {
    const {
        id_tipo_de_entrada,
        descricao,
        cfop_dentro,
        cfop_fora,
        ativo,
        movimenta_estoque,
        hab_agrupamento,
        hab_movimento,
        habilita_nf,
        atualiza_produto,
        padrao
    } = req.body;

    try {
        const query = `
            INSERT INTO sga.tipos_de_saida
            (id_tipo_de_entrada, descricao, cfop_dentro, cfop_fora, ativo, movimenta_estoque, hab_agrupamento, hab_movimento, habilita_nf, atualiza_produto, padrao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
        const values = [id_tipo_de_entrada, descricao, cfop_dentro, cfop_fora, ativo, movimenta_estoque, hab_agrupamento, hab_movimento, habilita_nf, atualiza_produto, padrao];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Tipo de saida criado com sucesso!', tipo_de_saida: result.rows[0] });
    } catch (err) {
        console.error('Erro ao inserir tipo de saida:', err);
        res.status(500).json({ message: 'Erro ao inserir tipo de saida', error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
