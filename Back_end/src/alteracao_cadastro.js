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
    data_criacao: new Date(), // Adiciona a data atual
    imagePath: '/uploads/default.jpg' //
};

// Função para inserir dados
async function insertData() {
    try {
        await client.connect(); // Conecta ao banco de dados

        // Query SQL para inserir dados
        const query = `
            INSERT INTO sga.usuario (nome, email, celular, senha, data_criacao, image_path)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        // Executa a query
        const res = await client.query(query, [
            dados.nome,
            dados.email,
            dados.celular,
            dados.senha,
            dados.data_criacao,
            dados.imagePath
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

app.use(cors({
  origin: ['http://127.0.0.1:5503', 'http://localhost:3000'],
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para formulários HTML


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
  },
  dest: 'uploads/'
});

// Rota para upload
app.post('/upload', upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const query = `
    INSERT INTO sga.usuario (nome, email, celular, senha, data_criacao, image_path)
    VALUES ($1, $2, $3, $4, $5, $6)
`;
    
    const values = [
      req.body.nome || 'Usuário Teste',
      req.body.email || 'teste@example.com',
      req.body.celular || '',
      req.body.senha || '',
      new Date(),
      imagePath
    ];

    const result = await pool.query(query, values);
    
    res.json({ 
      success: true,
      imageUrl: imagePath,
      userId: result.rows[0].id
    });
  } catch (error) {
    // ... (mantenha o tratamento de erro)
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
