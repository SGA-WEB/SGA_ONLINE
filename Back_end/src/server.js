import express from 'express';
import session from 'express-session';
import pkg from 'pg';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ertkiirzzswpxkgcxret.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydGtpaXJ6enN3cHhrZ2N4cmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEyMzMwNCwiZXhwIjoyMDYxNjk5MzA0fQ.sldy2ROLnO14WI-Iam1iqjCyfHA2wfWFNWcbwcI1snE';
const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;
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
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const userResult = await pool.query('SELECT * FROM sga.usuario WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'E-mail não encontrado' });
        }

        const senhaResult = await pool.query('SELECT * FROM sga.usuario WHERE email = $1 AND senha = $2', [email, senha]);

        if (senhaResult.rows.length === 0) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Criar sessão
        req.session.user = {
            id: userResult.rows[0].id_usuario,
            nome: userResult.rows[0].nome,
            email: userResult.rows[0].email
        };

        res.json({ message: 'Login bem-sucedido' });

    } catch (error) {
        console.error(error);
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
app.get('/api/imagem/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const { data: { publicUrl } } = supabase.storage
        .from('fotos-usuarios')
        .getPublicUrl(`${id}.webp`);

      // 3. Retorna a URL ou redireciona
      res.json({
        success: true,
        imageUrl: publicUrl,
        // Ou para servir diretamente o arquivo:
        // imageData: await fetch(publicUrl).then(res => res.blob())
      });

    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar imagem' });
    }
  });

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

