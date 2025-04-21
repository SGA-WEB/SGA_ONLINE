const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware de segurança e parsing
app.use(cors({
  origin: ['http://127.0.0.1:5432', 'http://localhost:3000'],
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pool de conexão com o banco
const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-super-dawn-a8jw0z8d-pooler.eastus2.azure.neon.tech',
  database: 'neondb',
  password: 'npg_Y3ZNL6fxehGI',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Configuração do Multer para armazenamento de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  }
});

// Rota para upload de imagem
app.post('/upload', upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const imagePath = `/uploads/${req.file.filename}`;
    const query = `
      INSERT INTO sga.usuario (nome, email, celular, senha, data_criacao, grupo, image_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
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

    // Retorna a resposta com a URL da imagem e o ID do usuário
    res.json({ 
      success: true,
      imageUrl: imagePath,
      userId: result.rows[0].id
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Servir imagens estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Teste de servidor
app.get('/', (req, res) => {
  res.send('Servidor de upload funcionando!');
});

// Inicia o servidor na porta especificada ou 3000 por padrão
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
