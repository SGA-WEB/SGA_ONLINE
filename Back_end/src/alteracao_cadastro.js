const { Client } = require('pg');

// Configurações de conexão com o banco de dados
const client = new Client({
  user: 'neondb_owner',
  host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech',
  database: 'neondb',
  password: 'npg_Y3ZNL6fxehGI',
  port: 5432,
  ssl: {
      rejectUnauthorized: false, // Permite a conexão mesmo sem verificar o certificado
  },
});

// Dados que você deseja inserir
const dados = {
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    celular: '11987654321',
    senha: 'senha123',
    data_criacao: new Date() // Adiciona a data atual
};

// Função para inserir dados
async function insertData() {
    try {
        await client.connect(); // Conecta ao banco de dados

        // Query SQL para inserir dados
        const query = `
            INSERT INTO sga.usuario (nome, email, celular, senha, data_criacao)
            VALUES ($1, $2, $3, $4, $5)
        `;

        // Executa a query
        const res = await client.query(query, [
            dados.nome,
            dados.email,
            dados.celular,
            dados.senha,
            dados.data_criacao
        ]);

        console.log('Dados inseridos com sucesso:', );
    } catch (err) {
        console.error('Erro ao inserir dados:', err);
    } finally {
        await client.end(); // Fecha a conexão com o banco de dados
    }
}

async function getData() {
  try {
      await client.connect(); // Conecta ao banco de dados

      // Query SQL para buscar dados
      const query = 'SELECT * FROM sga.usuario';
      const res = await client.query(query);

      console.log('Dados encontrados:');
      console.log(res.rows); // Exibe os dados no console
  } catch (err) {
      console.error('Erro ao buscar dados:', err);
  } finally {
      await client.end(); // Fecha a conexão com o banco de dados
  }
}

// Escolha qual função executar
const operation = process.argv[2]; // Recebe a operação como argumento na linha de comando

if (operation === 'insert') {
  insertData(); // Executa a função de inserção
} else if (operation === 'get') {
  getData(); // Executa a função de consulta
} else {
  console.log('Operação inválida. Use "insert" ou "get".');
}

//salvar imagem no back

const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors()); // Habilita CORS para o frontend

// Configuração do NeonDB (PostgreSQL)

// Configuração do Multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  }
});

// Rota para upload
app.post('/upload', upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Salva no banco de dados (NeonDB)
    const imagePath = `/uploads/${req.file.filename}`;
    const query = `
      INSERT INTO usuarios (nome, email, image_path) 
      VALUES ($1, $2, $3) 
      RETURNING id
    `;
    
    // Substitua pelos dados reais do seu formulário
    const values = [
      req.body.nome || 'Usuário Teste', 
      req.body.email || 'teste@example.com',
      imagePath
    ];

    const result = await pool.query(query, values);
    
    res.json({ 
      success: true,
      imageUrl: imagePath,
      userId: result.rows[0].id
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    
    // Remove o arquivo se houve erro no banco de dados
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Erro ao processar a imagem',
      details: error.message
    });
  }
});

// Servir arquivos estáticos (para acessar as imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor de upload funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});